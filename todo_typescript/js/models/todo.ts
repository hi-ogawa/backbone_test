/// <reference path='../_all.ts' />

module app {
    
    interface todoAttributes {
    	title: string;
    	completed: boolean;
    }

    export class Todo extends Backbone.Model {

	// typed getter
	title()     : string  { return super.get("title"); }
	completed() : boolean { return super.get("completed"); }

	// typed setter
	setTSC(arg : todoAttributes) {
	    super.set(arg);
	}
	setTitle(arg : string)      { super.set("title", arg); }
	setCompleted(arg : boolean) { super.set("completed", arg); }

	// it seems this isn't working
	defaults() { 
	    return {
		title: '',
		completed: false
	    };
	}

	toggle() {
	    this.setCompleted(!this.completed());
	    // this.save({completed: !this.completed()});
	}
    }
}