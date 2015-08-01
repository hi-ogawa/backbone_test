/// <reference path='../_all.ts' />

module app {
    var samples : (string | boolean)[][] = [
	['drink milk', false],
	['eat fried rice', false],
	['take pills', true]
    ];

    export class TodoList extends Backbone.Collection<Todo> {
	constructor() {
	    var sampleModels = _(samples).map(function(s) {
		return new app.Todo({title: s[0], completed: s[1]});
	    });
	    super(sampleModels);
	}
    }
}
