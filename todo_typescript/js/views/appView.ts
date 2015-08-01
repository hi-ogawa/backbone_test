/// <reference path='../_all.ts' />

module app {
    // we don't assign any model to this view, which is why I give <Backbone.Model> as a generic argument of `Backbone.View`
    export class AppView extends Backbone.View<Backbone.Model> {
	// el = "#todoapp"; // this cannot work since this property is set after `super`
	$input: JQuery;
	$list: JQuery;

	constructor() {
	    var options : Backbone.ViewOptions<Backbone.Model> = {
		el: "#todoapp"
	    };
	    super(options);

	    this.$input = this.$("#new-todo");
	    this.$list = this.$("#todo-list");

	    this.render();

	    todoList.on("add", this.render, this);
	}

	render() {
	    this.$list.empty();
	    todoList.each(this.addOne, this);
	    // _.each(todoList.models, this.addOne, this); // same as above
	    return this;
	}

	addOne(todo : Todo) {
	    var todoView = new TodoView({model: todo});
	    this.$list.append(todoView.$el);
	}

	events() {
	    return {"keypress #new-todo": "createTodoOnEnter"};
	}

	createTodoOnEnter (e : {which : number}) {
	    var val = this.$input.val().trim();
	    if(e.which !== 13 || val === ""){ return; }
	    todoList.add({title: val, completed: false});
	    // todoList.add({title: val}); // why doesn't' this work?
	    this.$input.val("");
	}
    }
}