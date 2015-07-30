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
    className: "list-group-item"
    template: _.template $("#item-template").html()

    initialize: ->
      this.render()
      this.model.on "change", this.render, this

    render: ->
      this.$el.html this.template(this.model.toJSON())
      this.input = this.$(".edit")

    events:
      "dblclick .title" : "edit"
      "blur     .edit"  : "close"
      "keypress .edit"  : "updateOnEnter"

    edit: ->
      this.$el.addClass "editing"
      this.input.focus()      

    close: ->
      value = this.input.val().trim()
      if value
        this.model.save {title: value}
      else
        this.input.val(this.model.title)
      this.$el.removeClass "editing"
          
    updateOnEnter: (e) ->
      if e.which is 13 then this.close()
    

  # define a main view and its logic (controller)
  app.AppView = Backbone.View.extend

    el: "#todoapp"

    initialize: ->
      this.input = this.$("#new-todo")
      this.ul    = this.$("#todo-list")
      app.todoList.on "add", this.addOne, this
      app.todoList.fetch()

    addOne: (todo) ->
      view = new app.TodoView {model: todo}
      this.ul.append view.$el

    events:
      "keypress #new-todo": "createTodoOnEnter"

    # create new todo
    createTodoOnEnter: (e) ->
      if e.which isnt 13 or this.input.val().trim() is ""    then return

      app.todoList.create this.newAttributes()
      this.input.val("")
        
    newAttributes: ->
        title:     this.input.val()
        completed: false


  # instanciation of the view
  app.appView = new app.AppView()
