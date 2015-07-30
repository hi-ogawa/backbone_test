$ ->

  # namespace for this app
  app = {}


  # define a model for one piece of 'todo'
  app.Todo = Backbone.Model.extend
    defaults:
      title:     ""
      completed: false


  # define where to put the collection of models
  app.TodoList = Backbone.Collection.extend
    model:        app.Todo
    localStorage: new Backbone.LocalStorage "backbone-todo"

  # then generate its instance
  app.todoList = new app.TodoList()


  # define a view for each todo piece
  app.TodoView = Backbone.View.extend
    tagName: "li"
    template: _.template $("#item-template").html()
    render: ->
      this.$el.html this.template(this.model.toJSON())


  # define a main view and its logic (controller)
  app.AppView = Backbone.View.extend

    el: "#todoapp"

    initialize: ->
      this.input = this.$("#new-todo")
      app.todoList.on "add", this.addOne, this
      app.todoList.fetch()

    addOne: (todo) ->
      view = new app.TodoView {model: todo}
      view.render()
      $("#todo-list").append view.$el

    events:
      "keypress #new-todo": "createTodoOnEnter"
      "change .toggle":     "toggleCompletion"

    # create new todo
    createTodoOnEnter: (e) ->
      if e.which isnt 13 or this.input.val().trim() is ""    then return

      app.todoList.create this.newAttributes()
      this.input.val("")
        
    newAttributes: ->
        title:     this.input.val()
        completed: false

    # toggle completion state
    toggleCompletion: ->

  # instanciation of the view
  app.appView = new app.AppView()
