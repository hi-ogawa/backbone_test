// Generated by CoffeeScript 1.9.3
(function() {
  $(function() {
    var AppView, appView;
    AppView = Backbone.View.extend({
      el: '#container',
      initialize: function() {
        return this.render();
      },
      render: function() {
        return this.$el.html("Hello World");
      }
    });
    return appView = new AppView();
  });

}).call(this);
