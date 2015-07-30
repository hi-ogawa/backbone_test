$ ->

  AppView = Backbone.View.extend
   
    el: '#container'
   
    initialize: ->
      this.render()
   
    render: ->
      this.$el.html "Hello World"
   
  appView = new AppView()
