var school = require('angular').module('school');

school.controller('classEditController', function($scope, $stateParams, $location, appForm, lookupService, schoolFactory, SweetAlert, alertify, $interval){

  var vm = this;
  var _ = require('lodash');

  lookupService.getLookups('category')
                  .success(function(categories){
                    vm.categories = categories;
                  })
                  .error(function(err){
                    console.log('ERROR - could not load lookup values: medium'  );
                  });
      
  lookupService.getLookups('medium')
                      .success(function(mediums){
                        vm.mediums = mediums;
                      })
                      .error(function(err){
                        console.log('ERROR - could not load lookup values: category'  );
                      });

  lookupService.getLookups('classCapacity')
                      .success(function(classCapacity){
                        vm.classCapacity = classCapacity;
                      })
                      .error(function(err){
                        console.log('ERROR - could not load lookup values: category'  );
                      });

  init();

  function init(){
    
    vm.schoolid = $stateParams.schoolid;
    vm.isProgram = ($location.path().indexOf('program') >=0 ? true : false);
    vm.isClass = !vm.isProgram;
    vm.classid = $stateParams.classid;
    
    if (vm.isClass) {
      schoolFactory.getPrograms() 
                   .success(function(programs){
                      vm.programs = programs;
                   })
                   .error(function(err){
                      alertify.error(err);
                   })
    } 

    if (vm.classid) {
        schoolFactory.getClass(vm.classid)
                    .success(function(claz) {
                      $scope.class = claz;
                    })
                    .error(function(err){
                      alertify.error("Failed to get class: " + err);
                    });
    } else {

        $scope.class = {  
                    school: vm.schoolid,
                    name: (vm.isProgram?'Program': 'Class'),
                    type: (vm.isProgram?'program': 'class'),
                    categories: [],
                    medium: [],
                    placeid: 'ChIJL-k0LnUTrjsRrmqYb6Y0ssI',
                    profile: '{"entityMap":{},"blocks":[{"key":"8me3g","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}',
                    gallery:[], 
                    attachments: [],
                    sections: []
                  };
    }



    $scope.form = new appForm.AppForm(angular, function(form){

        console.log('Autosaving form');
        console.log($scope.class);

        if ($scope.class._id) {
           schoolFactory.updateClass($scope.class)
                    .success(function(msg) {
                     // $scope.class = msg;
                    })
                    .error(function(err) {
                      alertify.error("Failed to update class: " + err);
                    })
        }
        else {
           schoolFactory.createClass($scope.class)
                    .success(function(msg) {
                      $scope.class = msg;
                    })
                    .error(function(err) {
                      alertify.error("Failed to update class: " + err);
                    })
        } 
       
        $scope.Form.$setPristine(true);

      });

      var inProgress = false;
      $interval(function(){
        if ($scope.Form && $scope.Form.$dirty && $scope.Form.$valid && $scope.class._id && !inProgress) {
          inProgress = true;
          $interval(function(){
            console.log('Saving form...');
            if ($scope.Form && $scope.Form.$dirty && $scope.Form.$valid){
              $scope.form.submit($scope.Form);
            }
            inProgress = false;
          }, 20000);
        } 
      }, 10000);




  
  };

  //TODO Make it directive
  //HANDLE CURRICULUM SECTION
  $scope.showAddSection = function() {
    $scope.sectionAdd = true;
    $scope.newSection = {
    }
  }

  $scope.hideAddSection = function() {
    $scope.sectionAdd = false;
  }

  $scope.showSuccess = false;
  $scope.addNewSection = function() {

    if (angular.isDefined($scope.newSection.title) && angular.isDefined($scope.newSection.summary)) {
      
      var seqnos = 1;
      if ($scope.class.sections) {
        seqnos = $scope.class.sections.map(function(section){
          return section.seq;
        });
      } else {
        $scope.class.sections = [];
      }

      var max = 1;
      if (seqnos && seqnos.length > 0) {
        max = Math.max.apply(null, seqnos) + 1;
      }
      $scope.newSection.seq = max;
      $scope.class.sections.push($scope.newSection);
      $scope.showSuccess = true;
      $scope.successMessage = 'Section added successfully.'
      setTimeout(function(){ 
        $scope.showSuccess = false; 
        $scope.$apply();
      }, 2000);

      $scope.newSection = {};
      $scope.sectionAdd = false;

      $scope.Form.$setDirty(true);
    }
  }

  $scope.resetSection = function(section) {

    section.edit = false;

    if (section.new) {
      $scope.removeSection(section.seq);
    }
  }

  $scope.removeSection = function (seq) {

    SweetAlert.swal(
      {   
        title: "Delete Section?",   
        text: "Are you sure you want to delete section!",   
        type: "warning",   
        showCancelButton: true,   
        confirmButtonColor: "#DD6B55",   
        confirmButtonText: "Yes, delete it!",   
        closeOnConfirm: true 
      }, 
        function(isConfirm)
        {   
          if (isConfirm){
             _.remove($scope.class.sections, function(section) { return section.seq === seq ;});
            // SweetAlert.swal("Deleted!", "Section deleted.", "success");
            $scope.Form.$setDirty(true);

             $scope.showSuccess = true;
              $scope.successMessage = 'Section added successfully.'
              setTimeout(function(){ 
                $scope.showSuccess = false; 
                $scope.$apply();
              }, 2000);


          }
        });
  }




  

});
