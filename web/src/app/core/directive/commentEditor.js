'use strict';

import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import CommentEditor from '../../shared/rte/CommentEditor';

var core = angular.module('core');

core.directive('commentEditor', function(){
  return {
    require: '?form',
    restrict: 'AE',
    scope:{
      content: '=',
      placeholder: '@',
      readonly: '@',
      onSelect: '&'
    },
    controller: function($scope) {
    },
    link: function(scope, elm, $attributes, formController){

      let readonly = false;
      let reactElem = undefined;
      const placeholder = (scope.placeholder?scope.placeholder:'Enter comments here..')
      if (scope.readonly && scope.readonly === 'true') {
        readonly = true;
      }

      //TODO Rename to COMMENT_RESET
      scope.$on('POST_RESET', function(e) {
      	if (reactElem) {
      		reactElem.reset();
      	}
      });

      scope.$watch('content', function(value){
		let draftContent = scope.content; 
		let commentEditor = <CommentEditor content={draftContent} placeholder={placeholder} update={setContent} readonly={readonly} onSelect={scope.onSelect} />;
		reactElem = ReactDOM.render(commentEditor, elm[0]);
      });

      

      function setContent(content){
      	if (scope.content === content) {
      		return;
      	}
        scope.content = content;
        scope.$apply();
        if (formController) {
        	formController.$setDirty(true);
        }
      } 
    }
  };
});
