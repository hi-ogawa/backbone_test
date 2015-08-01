/// <reference path='../_all.ts' />

module app {
    
    export enum Filter {All, Completed, Pending};

    // we don't assign any model to this view, which is why I give <Backbone.Model> as a generic argument of `Backbone.View`
    export class AppView extends Backbone.View<Backbone.Model> {
	// el = "#todoapp"; // this cannot work since this property is set after `super`
	$input: JQuery;
	$list: JQuery;
	sort:   boolean;
	filter: Filter;

	constructor() {
	    var options : Backbone.ViewOptions<Backbone.Model> = {
		el: "#todoapp"
	    };
	    super(options);

	    this.$input = this.$("#new-todo");
	    this.$list = this.$("#todo-list");
	    this.sort = false;
	    this.filter = Filter.All;

	    this.render();

	    todoList.on("change", this.render, this);
	}

	render() {
	    this.$list.empty();

	    var ls = todoList.filteredList(this.filter);
	    if(this.sort){
		ls = _.sortBy(ls, function(todo) { return todo.title(); });
	    }
	    _.each(ls, this.addOne, this);

	    this.setButtonColor();
	    return this;
	}

	setButtonColor() {
	    function toggleColor($dom, c0, c1, b0) {
		$dom.toggleClass(c0, b0).toggleClass(c1, !b0);
	    }
	    toggleColor(this.$(".set-all"),       "btn-warning", "btn-default", this.filter === Filter.All);
	    toggleColor(this.$(".set-completed"), "btn-warning", "btn-default", this.filter === Filter.Completed);
	    toggleColor(this.$(".set-pending"),   "btn-warning", "btn-default", this.filter === Filter.Pending);
	    toggleColor(this.$(".set-sort"), "btn-info", "btn-default", this.sort);
	}

	addOne(todo : Todo) {
	    var todoView = new TodoView({model: todo});
	    this.$list.append(todoView.$el);
	}

	events() {
	    return {
		"keypress #new-todo": "createTodoOnEnter",
		"click .set-all"       (){ this.filter = Filter.All; },
		"click .set-completed" (){ this.filter = Filter.Completed; },
		"click .set-pending"   (){ this.filter = Filter.Pending; },
		"click .set-sort"      (){ this.sort = !this.sort; },
		"click .sets"          (){ this.render(); }
	    };
	}

	createTodoOnEnter (e : {which : number}) {
	    var val = this.$input.val().trim();
	    if(e.which !== 13 || val === ""){ return; }
	    todoList.add({title: val, completed: false});
	    // todoList.add({title: val}); // why doesn't' this work? (defaults in todo.ts)
	    // todoList.create({title: val});  // for storage
	    this.$input.val("");
	}
    }
}