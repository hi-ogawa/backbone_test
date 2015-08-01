/// <reference path='../_all.ts' />

module app {
    var samples : (string | boolean)[][] = [
	['watch breaking bad', true],
	['take a bath', false],
	['go to beach', true]
    ];

    export class TodoList extends Backbone.Collection<Todo> {
	localStorage: any;

	constructor() {
	    this.model = Todo;
	    this.localStorage = new Backbone.LocalStorage("backbone-todo-typescript");
	    super();
	}

	initialize() {
	    this.fetch();

	    if(this.length === 0) {
		_(samples).each(function(s) {
		    this.create({title: s[0], completed: s[1]});
		}, this);
	    }
	}

	// `app.Filter` is in appView.ts
	filteredList(f : Filter) {
	    switch(f) {
	    case Filter.All:
		return this.models;
	    case Filter.Completed:
		return this.where({completed: true});
	    case Filter.Pending:
		return this.where({completed: false});
	    }
	}
    }
}
