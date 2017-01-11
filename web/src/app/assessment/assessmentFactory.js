'use strict';

var assessment = require('angular').module('assessment');

assessment.factory('assessmentFactory', function($http){

	return {
		getDraftAssessments: function(postid){
			return $http.get('api/assessments'  );
		},
		getAssessments: function(postid){
			return $http.get('api/assessments/' + postid  );
		},
		createAssessment: function(assessment) {
			return $http.post('api/assessments'   , assessment );
		},
		updateAssessment: function(assessment) {
			return $http.put('api/assessment/' + assessment._id   , assessment );
		},
		deleteAssessment: function(assesmentid) {
			return $http.delete('api/assessment/' + assesmentid );
		},
		
	};

});
