const wall = require('angular').module('wall');

wall.controller('navController', function($scope, $rootScope, postFactory){

	var _ = require('lodash');

	let vm = this;

	init();

	function init() {


		vm.postTypes = [
		{ 
			name: 'Discussion', 
			icon: 'fa-exchange' ,
			newItems: 3
		},
		{ 
			name: 'Message', 
			icon: 'fa-envelope-o' ,
			newItems: 2
		},
		{ 
			name: 'Assignment', 
			icon: 'fa-puzzle-piece' 
		},
		{ 
			name: 'Notification', 
			icon: 'wb-bell' 
		},
		{ 
			name: 'Blog', 
			icon: 'wb-bold' ,
			newItems: 3
		},
		{ 
			name: 'Material', 
			icon: 'fa-file-o' 
		},
		{ 
			name: 'Newsletter', 
			icon: 'fa-file-text-o' 
		},
		{ 
			name: 'Task', 
			icon: 'wb-check' 
		},
		{ 
			name: 'Assessments', 
			icon: 'fa-tachometer' 
		},
		{ 
			name: 'Grades', 
			icon: 'fa-bar-chart' 
		},
		{ 
			name: 'Polls', 
			icon: 'fa-tasks' 
		}];

		//get programs and classes
		//const {programs, classes} = postFactory.getClasses();

		postFactory.getProgramsclasses('5804c981f86ff447eb5ecadb')
				   .success(function(classes) {

					vm.programs = classes.filter((c) => c.type === 'program')
				   		.map((c)=> {
				   			return {
				   				id: c._id,
				   				name: c.name,
				   			}
				   		});

				   	vm.classes = classes.filter((c) => c.type === 'class')
				   		.map((c)=> {
				   			return {
				   				id: c._id,
				   				name: c.name,
				   				program: c.program
				   			}
				   		});

				   	// vm.programs = [];
				   	// vm.classes =
				   	// 	classes.map(function(claz) {
				   	// 		return {
				   	// 			id: claz._id,
				   	// 			name: claz.name,
				   	// 		};
				   	// 	});

			   		vm.selection = {};
					vm.visibleClasses = vm.classes;

					vm.hasPrograms = (vm.programs.length>0?true:false);
					vm.hasClasses = (vm.classes.length>0?true:false);

					vm.fireSelection(vm.selection);
				   })
				   .error(function(err){
				   		console.log(err);
				   })

		//vm.programs = programs; 
		//vm.classes = classes;
		
	}

	vm.selectPostType = (postType) => {
		if (vm.selection.postType && vm.selection.postType.name === postType.name) {
			vm.selection.postType = undefined;
		} else {
			vm.selection.postType = postType;
		}
		vm.fireSelection(vm.selection);
	};

	vm.selectProgram = (id) => {
		if (vm.selection.program && vm.selection.program.id === id) {
			vm.selection.program = undefined;
		}
		else {
			const program = _.find(vm.programs, (p) => { return p.id === id});
			vm.selection.program = program;
		}

		vm.selection.class = undefined;

		if (vm.selection.program) {
			vm.visibleClasses = _.filter(vm.classes, (c)=>{return c.program === id});
		} else {
			vm.visibleClasses = vm.classes;
		}

		vm.fireSelection(vm.selection);
	};


	vm.selectClass = (id) => {

		if (vm.selection.class && vm.selection.class.id === id) {
			vm.selection.class = undefined;
		}
		else {
			const claz = _.find(vm.classes, (p) => { return p.id === id});
			vm.selection.class = claz;
		}

		vm.fireSelection(vm.selection);
	};

	vm.fireSelection = (selection) => {
		
		
		let sendSelection = {};
	    Object.assign(sendSelection, selection);

	    //If program is not selected but class is, the include program information also in the event
	    if (!selection.program && selection.class) {
			const program = _.find(vm.programs, (p) => {return p.id === selection.class.program});
			sendSelection.program = program;
		}
		sendSelection.programs = vm.programs;
		sendSelection.classes = vm.classes;

		if (sendSelection.class) {
			sendSelection.classLabel = sendSelection.class.name;
		}
		if (sendSelection.program) {
			sendSelection.programLabel = sendSelection.program.name;
		}

		if (!sendSelection.class && sendSelection.classes && sendSelection.classes.length > 0 ) {
			sendSelection.classLabel = 'All classes';
		}

		if (!sendSelection.class && !sendSelection.program  && sendSelection.programs && sendSelection.programs.length > 0 ) {
			sendSelection.programLabel = 'All programs';
		}

		$rootScope.$emit('WALL_NAV_CHANGED', sendSelection);
	}
});