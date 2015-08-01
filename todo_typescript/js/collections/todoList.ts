/// <reference path='../_all.ts' />

module app {
    var samples : (string | boolean)[][] = [
	['watch breaking bad', true],
	['take a bath', false],
	['go to beach', true]
    ];

    export class TodoList extends Backbone.Collection<Todo> {
	constructor() {
	    this.model = Todo;
	    super();

	    var sampleModels = _(samples).map(function(s) {
		return new app.Todo({title: s[0], completed: s[1]});
	    });
	    this.set(sampleModels);
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
