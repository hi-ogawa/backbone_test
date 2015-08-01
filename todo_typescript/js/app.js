/// <reference path='../_all.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var app;
(function (app) {
    var Todo = (function (_super) {
        __extends(Todo, _super);
        function Todo() {
            _super.apply(this, arguments);
        }
        Todo.prototype.defaults = function () {
            return {
                title: '',
                completed: false
            };
        };
        // typed getter
        Todo.prototype.title = function () { return _super.prototype.get.call(this, "title"); };
        Todo.prototype.completed = function () { return _super.prototype.get.call(this, "completed"); };
        // typed setter
        Todo.prototype.setTSC = function (arg) {
            _super.prototype.set.call(this, arg);
        };
        Todo.prototype.setTitle = function (arg) { _super.prototype.set.call(this, "title", arg); };
        Todo.prototype.setCompleted = function (arg) { _super.prototype.set.call(this, "completed", arg); };
        Todo.prototype.toggle = function () {
            this.setCompleted(!this.completed());
            // this.save({completed: !this.completed()});
        };
        return Todo;
    })(Backbone.Model);
    app.Todo = Todo;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    var samples = [
        ['watch breaking bad', true],
        ['take a bath', false],
        ['go to beach', true]
    ];
    var TodoList = (function (_super) {
        __extends(TodoList, _super);
        function TodoList() {
            this.model = app.Todo;
            _super.call(this);
            var sampleModels = _(samples).map(function (s) {
                return new app.Todo({ title: s[0], completed: s[1] });
            });
            this.set(sampleModels);
        }
        // `app.Filter` is in appView.ts
        TodoList.prototype.filteredList = function (f) {
            switch (f) {
                case app.Filter.All:
                    return this.models;
                case app.Filter.Completed:
                    return this.where({ completed: true });
                case app.Filter.Pending:
                    return this.where({ completed: false });
            }
        };
        return TodoList;
    })(Backbone.Collection);
    app.TodoList = TodoList;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    var TodoView = (function (_super) {
        __extends(TodoView, _super);
        // constructor(opt : Backbone.ViewOptions<Todo>) { // originally option could be this
        function TodoView(arg) {
            var options = {
                tagName: "li",
                className: "list-group-item"
            };
            this.template = _.template($("#item-template").html());
            this.editing = false;
            _super.call(this, _.extend(arg, options));
            this.render();
            // events for model change
            this.model.on("destroy", this.remove, this);
            this.model.on("change", this.render, this);
        }
        TodoView.prototype.render = function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$input = this.$(".edit");
            this.$label = this.$(".title");
            this.showHideEditBox();
            return this;
        };
        TodoView.prototype.showHideEditBox = function () {
            this.$input.toggle(this.editing);
            this.$label.toggle(!this.editing);
        };
        TodoView.prototype.events = function () {
            return {
                "dblclick .title": "editTodo",
                "keypress .edit": "finishEditOnEnter",
                "blur     .edit": "finishEdit",
                "click .destroy": "removeTodo",
                "click .done": "toggleTodo"
            };
        };
        TodoView.prototype.editTodo = function () {
            this.editing = true;
            this.showHideEditBox();
            this.$input.focus();
        };
        TodoView.prototype.finishEditOnEnter = function (e) {
            if (e.which === 13) {
                var val = this.$input.val().trim(); //
                if (val !== "") {
                    this.model.setTitle(val);
                    this.finishEdit();
                }
                this.$input.val(this.$label.text());
            }
        };
        TodoView.prototype.finishEdit = function () {
            this.editing = false;
            this.showHideEditBox();
        };
        TodoView.prototype.removeTodo = function () {
            this.model.destroy();
        };
        TodoView.prototype.toggleTodo = function () {
            this.model.toggle();
        };
        return TodoView;
    })(Backbone.View);
    app.TodoView = TodoView;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    (function (Filter) {
        Filter[Filter["All"] = 0] = "All";
        Filter[Filter["Completed"] = 1] = "Completed";
        Filter[Filter["Pending"] = 2] = "Pending";
    })(app.Filter || (app.Filter = {}));
    var Filter = app.Filter;
    ;
    // we don't assign any model to this view, which is why I give <Backbone.Model> as a generic argument of `Backbone.View`
    var AppView = (function (_super) {
        __extends(AppView, _super);
        function AppView() {
            var options = {
                el: "#todoapp"
            };
            _super.call(this, options);
            this.$input = this.$("#new-todo");
            this.$list = this.$("#todo-list");
            this.sort = false;
            this.filter = Filter.All;
            this.render();
            app.todoList.on("change", this.render, this);
            app.todoList.on("add", this.render, this);
        }
        AppView.prototype.render = function () {
            this.$list.empty();
            var ls = app.todoList.filteredList(this.filter);
            if (this.sort) {
                ls = _.sortBy(ls, function (todo) { return todo.title(); });
            }
            _.each(ls, this.addOne, this);
            this.setButtonColor();
            return this;
        };
        AppView.prototype.setButtonColor = function () {
            function toggleColor($dom, c0, c1, b0) {
                $dom.toggleClass(c0, b0).toggleClass(c1, !b0);
            }
            toggleColor(this.$(".set-all"), "btn-warning", "btn-default", this.filter === Filter.All);
            toggleColor(this.$(".set-completed"), "btn-warning", "btn-default", this.filter === Filter.Completed);
            toggleColor(this.$(".set-pending"), "btn-warning", "btn-default", this.filter === Filter.Pending);
            toggleColor(this.$(".set-sort"), "btn-info", "btn-default", this.sort);
        };
        AppView.prototype.addOne = function (todo) {
            var todoView = new app.TodoView({ model: todo });
            this.$list.append(todoView.$el);
        };
        AppView.prototype.events = function () {
            return {
                "keypress #new-todo": "createTodoOnEnter",
                // todo filter is done via hashtag url
                // "click .set-all"       (){ this.filter = Filter.All; },
                // "click .set-completed" (){ this.filter = Filter.Completed; },
                // "click .set-pending"   (){ this.filter = Filter.Pending; },
                "click .set-sort": function () { this.sort = !this.sort; },
                "click .sets": function () { this.render(); }
            };
        };
        AppView.prototype.createTodoOnEnter = function (e) {
            var val = this.$input.val().trim();
            if (e.which !== 13 || val === "") {
                return;
            }
            app.todoList.add({ title: val });
            // todoList.create({title: val});  // for storage
            this.$input.val("");
        };
        return AppView;
    })(Backbone.View);
    app.AppView = AppView;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    var FilterRouter = (function (_super) {
        __extends(FilterRouter, _super);
        function FilterRouter() {
            _super.apply(this, arguments);
        }
        // to use in this way, you need to comment out `routes: any`
        // and add `routes(): any`in backbone.d.ts
        FilterRouter.prototype.routes = function () {
            return {
                "filter/:query": "jumpToFilter"
            };
        };
        // you can also define routes like this (not in `initialize`, but in `constructor`):
        // constructor() {
        //     super({
        // 	routes: {
        // 	    "filter/:query": "jumpToFilter"
        // 	}
        //     });
        // }
        FilterRouter.prototype.jumpToFilter = function (query) {
            switch (query) {
                case "all":
                    app.appView.filter = app.Filter.All;
                    break;
                case "completed":
                    app.appView.filter = app.Filter.Completed;
                    break;
                case "pending":
                    app.appView.filter = app.Filter.Pending;
                    break;
            }
            app.appView.render();
        };
        return FilterRouter;
    })(Backbone.Router);
    app.FilterRouter = FilterRouter;
})(app || (app = {}));
/// <reference path='_all.ts' />
var app;
(function (app) {
    app.todoList = new app.TodoList();
    app.appView = new app.AppView();
    new app.FilterRouter();
    Backbone.history.start();
})(app || (app = {}));
/// <reference path='libs/jquery.d.ts' />
/// <reference path='libs/underscore.d.ts' />
/// <reference path='libs/backbone.d.ts' />
/// <reference path='models/todo.ts' />
/// <reference path='collections/todoList.ts' />
/// <reference path='views/todoView.ts' />
/// <reference path='views/appView.ts' />
/// <reference path='routers/filter.ts' />
/// <reference path='app.ts' />
