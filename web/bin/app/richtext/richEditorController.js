'use strict';

import React, {Component} from 'react';
import RichEditor from '../shared/rte/RichEditor';
import ReactDOM from 'react-dom';


var richtext = require('angular').module('richtext');

richtext.directive('richEditor', function(postFactory){
  return {
    require: '?form',
    restrict: 'AE',
    scope:{
      content: '=',
      placeholder: '@',
      readonly: '@'
    },
    controller: function($scope) {
    },
    link: function(scope, elm, $attributes, formController){
      let readonly = false;
      let reactElem = undefined;
      const placeholder = (scope.placeholder?scope.placeholder:'Write your story here..')
      if (scope.readonly && scope.readonly === 'true') {
        readonly = true;
      }

      //TODO Rename to COMMENT_RESET
      // scope.$on('POST_RESET', function(e) {
      //   if (reactElem) {
      //     reactElem.reset();
      //   }
      // });

      scope.$watch('content', function(value, oldValue){
        if (value != undefined) {
            let draftContent = value; 
            let commentEditor = <RichEditor content={draftContent} update={setContent} readonly={readonly}/>;
            reactElem = ReactDOM.render(commentEditor, elm[0]);
          }
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
