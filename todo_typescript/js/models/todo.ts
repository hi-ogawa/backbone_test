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
	    super.save(arg);
	}
	setTitle(arg : string)      { super.save("title", arg); }
	setCompleted(arg : boolean) { super.save("completed", arg); }

	toggle() {
	    this.setCompleted(!this.completed());
	}
    }
}