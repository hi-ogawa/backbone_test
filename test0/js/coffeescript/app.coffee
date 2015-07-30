$ ->

  AppView = Backbone.View.extend
   
    el: '#container'

    template: _.template $("#template0").html()
   
    initialize: ->
      this.render()
   

    render: ->

      vars = {label_var: "set in backbone template"}
      this.$el.html this.template(vars)


  appView = new AppView()
