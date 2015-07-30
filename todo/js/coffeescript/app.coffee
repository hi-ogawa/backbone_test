$ ->

  # namespace for this app
  app = {}


  # define a model for one piece of 'todo'
  app.Todo = Backbone.Model.extend
    defaults:
      title:     ""
      completed: false

    toggle: ->
      this.save {completed: !this.get('completed')}
    

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

      # render the template with model data
      # and define inner DOMs as view specific variables
      this.render()  

      # define view specific variables other than DOM (not depends on the model)
      this.editing = false

      # change binded doms depending on view specific variables
      this.render2()

      # bind events to the model
      this.model.on "change", (-> this.render(); this.render2()), this
      this.model.on "destroy", this.remove, this


    render: ->
      this.$el.html this.template(this.model.toJSON())
      this.$input = this.$(".edit")
      this.$label = this.$(".title")

    render2: ->
      this.$input.toggle this.editing
      this.$label.toggle !this.editing


    events:
      "dblclick .title"   : "edit"
      "keypress .edit"    : (e) -> if e.which is 13 then this.close()
      "blur     .edit"    : "close"
      "click    .done"    : -> this.model.toggle()
      "click    .destroy" : -> this.model.destroy()

    edit: ->
      this.editing = true
      this.render2()
      this.$input.focus()

    close: ->
      this.editing = false
      if value = this.$input.val().trim()
        this.model.save {title: value}
      else
        this.$input.val(this.model.title)
        this.render2()


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


  # instanciation of the view
  app.appView = new app.AppView()
