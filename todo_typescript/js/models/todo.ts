/// <reference path='../_all.ts' />

module app {
    
    interface todoAttributes {
    	title?: string;
    	completed?: boolean;
    }

    export class Todo extends Backbone.Model {

	// typed getter
	title()     : string  { return this.get("title"); }
	completed() : boolean { return this.get("completed"); }

	defaults() { 
	    return {
		title: '',
		completed: false
	    };
	}

	toggle() {
	    this.save({completed: !this.completed()});
	}
    }
}