'use strict';

import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import Blog from '../blog/Blog';
import CommentEditor from '../shared/rte/CommentEditor';


var post = require('angular').module('post');

post.directive('commentEditor', function(){
  return {
    require: '?form',
    restrict: 'AE',
    scope:{
      content: '=',
      readonly: '@',
      onSelect: '&',
      onReset: '&'
    },
    controller: function($scope) {
    },
    link: function(scope, elm, $attributes, formController){

      let readonly = false;

      if (scope.readonly && scope.readonly === 'true') {
        readonly = true;
      }

      scope.$on('POST_CREATED', function(e) {
      	console.log('POST CREATE RECEIVED');
      });

      scope.$watch('content', function(value){
    		let draftContent = scope.content; 
    		let commentEditor = <CommentEditor content={draftContent} update={setContent} readonly={readonly} onSelect={scope.onSelect} onReset={scope.onReset}/>;
    		ReactDOM.render(commentEditor, elm[0]);
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