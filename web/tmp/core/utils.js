var angular = require('angular');

return {
	AppForm : function(angular, handleSubmit, handleInvalid, handleReset) {
			return {
				submit: function (form) {

		            var firstError = null;

		            if (form.$invalid) {

		                var field = null, firstError = null;
		                for (field in form) {
		                    if (field[0] != '$') {
		                        if (firstError === null && !form[field].$valid) {
		                            firstError = form[field].$name;
		                        }

		                        if (form[field].$pristine) {
		                            form[field].$dirty = true;
		                        }
		                    }
		                }

		                angular.element('.ng-invalid[name=' + firstError + ']').focus();
		                if (handleInvalid) {
		                	handleInvalid();
		                }
	                	else {
				            swal("The form cannot be submitted because it contains validation errors!", "Errors are marked with a red, dashed border!", "error");
	                	}

		                return;

		            } else {
		                handleSubmit();
		            }

		        },
		        reset: function (form) {
		            handleReset();
		        }
			}
	    }
};
