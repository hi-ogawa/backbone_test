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
        // typed getter
        Todo.prototype.title = function () { return this.get("title"); };
        Todo.prototype.completed = function () { return this.get("completed"); };
        Todo.prototype.defaults = function () {
            return {
                title: '',
                completed: false
            };
        };
        Todo.prototype.toggle = function () {
            this.save({ completed: !this.completed() });
        };
        return Todo;
    })(Backbone.Model);
    app.Todo = Todo;
})(app || (app = {}));
/// <reference path='../_all.ts' />
var app;
(function (app) {
    var samples = [
        ['drink milk', false],
        ['eat fried rice', false],
        ['take pills', true]
    ];
    var TodoList = (function (_super) {
        __extends(TodoList, _super);
        function TodoList() {
            var sampleModels = _(samples).map(function (s) {
                return new app.Todo({ title: s[0], completed: s[1] });
            });
            _super.call(this, sampleModels);
        }
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
            _super.call(this, _.extend(arg, options));
            this.render();
        }
        TodoView.prototype.render = function () {
            this.$el.html(this.template(this.model.toJSON()));
            this.$input = this.$(".edit");
            this.$label = this.$(".title");
            return this;
        };
        return TodoView;
    })(Backbone.View);
    app.TodoView = TodoView;
})(app || (app = {}));
// initialize: ->
//   # render the template with model data
//   # and define inner DOMs as view specific variables
//   this.render()  
//   # define view specific variables other than DOM (not depends on the model)
//   this.editing = false
//   # change binded doms depending on view specific variables
//   this.render2()
//   # bind events to the model
//   this.model.on "change", (-> this.render(); this.render2()), this
//   this.model.on "destroy", this.remove, this
//   this.model.on "invalid", this.invalidHandle, this
// render: ->
//   this.$el.html this.template(this.model.toJSON())
//   this.$input = this.$(".edit")
//   this.$label = this.$(".title")
// render2: ->
//   this.$input.toggle this.editing
//   this.$label.toggle !this.editing
// events:
//   "dblclick .title"   : "edit"
//   "keypress .edit"    : (e) -> if e.which is 13 then this.close()
//   "blur     .edit"    : "close"
//   "click    .done"    : -> this.model.toggle()
//   "click    .destroy" : -> this.model.destroy()
// edit: ->
//   this.editing = true
//   this.render2()
//   this.$input.focus()
// close: ->
//   this.editing = false
//   this.model.save {title: this.$input.val().trim()}
// invalidHandle: (model, error) ->
//   alert error
//   this.$input.val model.get('title')
/// <reference path='../_all.ts' />
var app;
(function (app) {
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
            this.render();
            app.todoList.on("add", this.render, this);
        }
        AppView.prototype.render = function () {
            this.$list.empty();
            app.todoList.each(this.addOne, this);
            // _.each(todoList.models, this.addOne, this); // same as above
            return this;
        };
        AppView.prototype.addOne = function (todo) {
            var todoView = new app.TodoView({ model: todo });
            this.$list.append(todoView.$el);
        };
        AppView.prototype.events = function () {
            return { "keypress #new-todo": "createTodoOnEnter" };
        };
        AppView.prototype.createTodoOnEnter = function (e) {
            var val = this.$input.val().trim();
            if (e.which !== 13 || val === "") {
                return;
            }
            app.todoList.add({ title: val, completed: false });
            // todoList.add({title: val}); // why doesn't' this work?
            this.$input.val("");
        };
        return AppView;
    })(Backbone.View);
    app.AppView = AppView;
})(app || (app = {}));
/// <reference path='_all.ts' />
var app;
(function (app) {
    app.todoList = new app.TodoList();
    app.appView = new app.AppView();
})(app || (app = {}));
/// <reference path='libs/jquery.d.ts' />
/// <reference path='libs/underscore.d.ts' />
/// <reference path='libs/backbone.d.ts' />
/// <reference path='models/todo.ts' />
/// <reference path='collections/todoList.ts' />
/// <reference path='views/todoView.ts' />
/// <reference path='views/appView.ts' />
/// <reference path='app.ts' />
