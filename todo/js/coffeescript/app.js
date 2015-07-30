// Generated by CoffeeScript 1.9.3
(function() {
  $(function() {
    var app;
    app = {};
    app.Todo = Backbone.Model.extend({
      defaults: {
        title: "",
        completed: false
      },
      toggle: function() {
        return this.save({
          completed: !this.get('completed')
        });
      },
      validate: function(attrs, options) {
        if (attrs.title.length === 0) {
          return "todo title cannot be blank!";
        }
      }
    });
    app.TodoList = Backbone.Collection.extend({
      model: app.Todo,
      localStorage: new Backbone.LocalStorage("backbone-todo")
    });
    app.todoList = new app.TodoList();
    app.TodoView = Backbone.View.extend({
      tagName: "li",
      className: "list-group-item",
      template: _.template($("#item-template").html()),
      initialize: function() {
        this.render();
        this.editing = false;
        this.render2();
        this.model.on("change", (function() {
          this.render();
          return this.render2();
        }), this);
        this.model.on("destroy", this.remove, this);
        return this.model.on("invalid", this.invalidHandle, this);
      },
      render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$input = this.$(".edit");
        return this.$label = this.$(".title");
      },
      render2: function() {
        this.$input.toggle(this.editing);
        return this.$label.toggle(!this.editing);
      },
      events: {
        "dblclick .title": "edit",
        "keypress .edit": function(e) {
          if (e.which === 13) {
            return this.close();
          }
        },
        "blur     .edit": "close",
        "click    .done": function() {
          return this.model.toggle();
        },
        "click    .destroy": function() {
          return this.model.destroy();
        }
      },
      edit: function() {
        this.editing = true;
        this.render2();
        return this.$input.focus();
      },
      close: function() {
        this.editing = false;
        return this.model.save({
          title: this.$input.val().trim()
        });
      },
      invalidHandle: function(model, error) {
        alert(error);
        return this.$input.val(model.get('title'));
      }
    });
    app.AppView = Backbone.View.extend({
      el: "#todoapp",
      initialize: function() {
        this.input = this.$("#new-todo");
        this.ul = this.$("#todo-list");
        app.todoList.on("add", this.addOne, this);
        return app.todoList.fetch();
      },
      addOne: function(todo) {
        var view;
        view = new app.TodoView({
          model: todo
        });
        return this.ul.append(view.$el);
      },
      events: {
        "keypress #new-todo": "createTodoOnEnter"
      },
      createTodoOnEnter: function(e) {
        if (e.which !== 13 || this.input.val().trim() === "") {
          return;
        }
        app.todoList.create(this.newAttributes());
        return this.input.val("");
      },
      newAttributes: function() {
        return {
          title: this.input.val()
        };
      }
    });
    return app.appView = new app.AppView();
  });

}).call(this);
