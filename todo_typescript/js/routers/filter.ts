/// <reference path='../_all.ts' />

module app {
    export class FilterRouter extends Backbone.Router {
	// to use in this way, you need to comment out `routes: any`
	// and add `routes(): any`in backbone.d.ts
	routes () { 
	    return {
		"filter/:query": "jumpToFilter"
	    };
	}

	// you can also define routes like this (not in `initialize`, but in `constructor`):
	// constructor() {
	//     super({
	// 	routes: {
	// 	    "filter/:query": "jumpToFilter"
	// 	}
	//     });
	// }
	
	jumpToFilter(query) {
	    switch(query){
	    case "all":
		appView.filter = Filter.All; break;
	    case "completed":
		appView.filter = Filter.Completed; break;
	    case "pending":
		appView.filter = Filter.Pending; break;
	    }
	    appView.render();
	}
    }
}
