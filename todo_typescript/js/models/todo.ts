/// <reference path='../_all.ts' />

module app {
    
    interface todoAttributes {
    	title: string;
    	completed: boolean;
    }

    export class Todo extends Backbone.Model {

	defaults() { 
	    return {
		title: '',
		completed: false
	    };
	}

	// typed getter
	title()     : string  { return super.get("title"); }
	completed() : boolean { return super.get("completed"); }

	// typed setter
	setTSC(arg : todoAttributes) {
	    super.set(arg);
	}
	setTitle(arg : string)      { super.set("title", arg); }
	setCompleted(arg : boolean) { super.set("completed", arg); }

	toggle() {
	    this.setCompleted(!this.completed());
	    // this.save({completed: !this.completed()});
	}
    }
}