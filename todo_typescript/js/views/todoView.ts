/// <reference path='../_all.ts' />

module app {
    export class TodoView extends Backbone.View<Todo> {
	template : any;  // this property is not in Backbone.ViewOptions and not defined in backbone.d.td
	$input: JQuery;
	$label: JQuery;

	// constructor(opt : Backbone.ViewOptions<Todo>) { // originally option could be this
	constructor(arg : {model: Todo}) { // but we assume only the assignment of a model

	    var options : Backbone.ViewOptions<Todo> = {
		tagName:    "li",
		className:  "list-group-item"
	    };
	    this.template =  _.template($("#item-template").html())

	    super(_.extend(arg, options));
	    this.render();
	}

	render() {
	    this.$el.html(this.template(this.model.toJSON()));
	    this.$input = this.$(".edit");
	    this.$label = this.$(".title");
	    return this;
	}
    }
}



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
