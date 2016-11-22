'use strict';

import React, {Component} from 'react';
import RichText from './RichText';
import ReactDOM from 'react-dom';

var richtext = require('angular').module('richtext');

richtext.directive('richtext', function(postFactory){
  return {
    require: '?form',
    restrict: 'AE',
    scope:{
      onPublish: '&',
      onCancel: '&',
      richtextid: '@',
      readonly: '@'
    },
    controller: function($scope) {
    },
    link: function(scope, elm, $attributes, formController){

      var readonly = false;

      if (scope.readonly && scope.readonly === 'true') {
        readonly = true;
      }
      scope.$watch('richtextid', function(value){
          var draftContent = scope.content; 
          if (value) {
            ReactDOM.render(<RichText richtextid={value} readonly={readonly} service={postFactory} onPublish={scope.onPublish} onCancel={scope.onCancel}/>, elm[0]);
          } else {
          	ReactDOM.render(<RichText readonly={readonly} service={postFactory} onPublish={scope.onPublish} onCancel={scope.onCancel}/>, elm[0]);
          }
      });  
    }
  };
});


richtext.controller('richtextController', function($scope, $uibModalInstance, params){
	
	$scope.richtextid = params.richtextid; 
	$scope.readonly = params.readonly;

	$scope.onPublish = () => {
		$uibModalInstance.close('publish');
	}

	$scope.onCancel = (ret) => {
		$uibModalInstance.dismiss();
	}
	
});