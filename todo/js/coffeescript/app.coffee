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

    validate: (attrs, options) ->
      if attrs.title.length is 0
        "todo title cannot be blank!"


  # define where to put the collection of models
  app.TodoList = Backbone.Collection.extend
    model:        app.Todo
    localStorage: new Backbone.LocalStorage "backbone-todo"
    all:           -> this.filter -> true                  # to keep the same type as others
    completedList: -> this.filter (todo) -> todo.get("completed")
    pendingList:   -> this.filter (todo) -> !todo.get("completed")
    sortedList:    -> this.sortBy (todo) -> todo.get("title")

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
      this.model.on "invalid", this.invalidHandle, this

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
      this.model.save {title: this.$input.val().trim()}

    invalidHandle: (model, error) ->
      alert error
      this.$input.val model.get('title')


  # define a main view and its logic (controller)
  app.AppView = Backbone.View.extend

    el: "#todoapp"

    initialize: ->
      this.input = this.$("#new-todo")
      this.ul    = this.$("#todo-list")

      # view variables, the single source of truth
      this.set  = 0
      this.sort = false
    
      app.todoList.fetch()
      this.render2()

      app.todoList.on "change", this.render2, this

    render2: ->

      # filter todos
      this.ul.empty()
      ls = switch this.set
             when 0 then app.todoList.all()
             when 1 then app.todoList.completedList()
             when 2 then app.todoList.pendingList()

      if this.sort
        ls = _.sortBy ls, (todo) -> todo.get 'title'

      _.each ls, this.addOne, this
  
      # change button color
      this.$(".sets a").removeClass("btn-warning").addClass("btn-default")
      this.$(".set#{this.set}").removeClass("btn-default").addClass("btn-warning")

      this.$(".set3").toggleClass("btn-info", this.sort)
                     .toggleClass("btn-default", !this.sort)

    addOne: (todo) ->
      view = new app.TodoView {model: todo}
      this.ul.append view.$el

    events:
      "keypress #new-todo": "createTodoOnEnter"
      "click .set0": -> this.set = 0;           this.render2() 
      "click .set1": -> this.set = 1;           this.render2() 
      "click .set2": -> this.set = 2;           this.render2() 
      "click .set3": -> this.sort = !this.sort; this.render2() 


    # create new todo
    createTodoOnEnter: (e) ->
      if e.which isnt 13 or this.input.val().trim() is ""    then return

      app.todoList.create {title: this.input.val()}
      this.input.val("")


  # instanciation of the view
  app.appView = new app.AppView()
