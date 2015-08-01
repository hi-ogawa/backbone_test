/// <reference path='../_all.ts' />

module app {
    export class TodoView extends Backbone.View<Todo> {
	template : any;  // this property is not in Backbone.ViewOptions and not defined in backbone.d.td
	$input: JQuery;
	$label: JQuery;
	editing: boolean;

	// constructor(opt : Backbone.ViewOptions<Todo>) { // originally option could be this
	constructor(arg : {model: Todo}) { // but we assume only the assignment of a model

	    var options : Backbone.ViewOptions<Todo> = {
		tagName:    "li",
		className:  "list-group-item"
	    };
	    this.template =  _.template($("#item-template").html());
	    this.editing = false;

	    super(_.extend(arg, options));
	    this.render();

	    // events for model change
	    this.model.on("destroy", this.remove, this);
	    this.model.on("change", this.render, this);
	}

	render() {
	    this.$el.html(this.template(this.model.toJSON()));
	    this.$input = this.$(".edit");
	    this.$label = this.$(".title");
	    this.showHideEditBox();
	    return this;
	}

	showHideEditBox() {
	    this.$input.toggle(this.editing);
	    this.$label.toggle(!this.editing);
	}

	events() {
	    return {
		"dblclick .title": "editTodo",
		"keypress .edit":  "finishEditOnEnter",
		"blur     .edit":  "finishEdit",
		"click .destroy": "removeTodo",
		"click .done":    "toggleTodo"
	    };
	}
	
	editTodo() {
	    this.editing = true;
	    this.showHideEditBox();
	    this.$input.focus();
	}
	finishEditOnEnter(e : {which : number}) {
	    if(e.which === 13){
		var val : string = this.$input.val().trim(); //
		if(val !== ""){
		    this.model.setTitle(val);
		    this.finishEdit();
		}
		this.$input.val(this.$label.text());
	    }
	}
	finishEdit() {
	    this.editing = false;
	    this.showHideEditBox();
	}
	removeTodo() {
	    this.model.destroy();
	}
	toggleTodo() {
	    this.model.toggle();
	}
    }
}
