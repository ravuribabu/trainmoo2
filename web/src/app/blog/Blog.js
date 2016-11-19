'use strict';

import React, {Component} from 'react';
import RichEditor from '../shared/rte/RichEditor';
import ReactDOM from 'react-dom';
import {Editor, EditorState, ContentState, RichUtils, Entity, convertToRaw, convertFromRaw, convertFromHTML, getVisibleSelectionRect, AtomicBlockUtils, CompositeDecorator} from 'draft-js';

var blog = require('angular').module('blog');

blog.directive('blog', function(postFactory){
  return {
    require: '?form',
    restrict: 'AE',
    scope:{
      richtext: '=',
      readonly: '@',
      onPublish: '&',
      onCancel: '&'
    },
    controller: function($scope) {
    },
    link: function(scope, elm, $attributes, formController){

      var readonly = false;

      if (scope.readonly && scope.readonly === 'true') {
        readonly = true;
      }
      scope.$watch('richtext', function(value){
          var draftContent = scope.content; 
          ReactDOM.render(<Blog richtext={scope.richtext} readonly={readonly} service={postFactory} onPublish={scope.onPublish} onCancel={scope.onCancel}/>, elm[0]);
      });  
    }
  };
});


export default class Blog extends React.Component {

	constructor(props) {

		super(props);


		this.service = this.props.service;

		if (this.props.richtext) {
			this.draft = this.props.richtext;
			this.state = {
				content: this.props.richtext.text,
				dataLoaded: true
			}
		} else {
			this.state = {
				dataLoaded: false
			};
		}

		let autosaveInprogress = false;
		
		this.update = (content, currentContent) => {
			
			this.setState({
				content: content
			});

			if (content && !autosaveInprogress) {
				autosaveInprogress = true;
				setTimeout( () => {
					this.autosave();
					autosaveInprogress = false;
				}, 3000);
			}
			
			this.currentContent = currentContent;
		}

		this.save = () => {
			this.props.onCancel();
		}

		this.autosave = () => {

		}
		
		this.publish = () => {
			this.draft.text = this.state.content;
			this.draft.title = this.state.title;

			const imgs = this.currentContent
					.getBlocksAsArray()
					.filter(f => { return (f.getType() === 'atomic') } )
					.map((contentBlock) => {
						 
						var images = contentBlock.getCharacterList()
									.map((c) => {
										const entityKey = c.getEntity();
										const entity = Entity.get(entityKey);
										if (entity.type === 'image') {
											return entity.data.src.link;
										}
									});
						if (images && images.length > 0) {
							return images.get(0);
						}
					})
					.filter(x => {return x;});


			if (imgs && imgs.length > 0) {
				this.draft.previewImg = imgs[0];
			}
			this.draft.previewText = this.currentContent.getPlainText().replace(/  +/g, ' ').replace(/^\s*[\r\n]/gm).substring(0, 200);
			
			this.service.updateRichtext(this.draft)
						.success((data) => {
							console.log('Richtext saved successfully!');
							this.props.onPublish();
						})
						.error((err) => {
							console.log(err);
							this.props.onCancel();
						});


		}

		this.updateTitle = (e) => {
			this.setState({
				title : e.target.value
			});
		};
	}


	componentWillMount(){
		//get draft
		if (!this.state.dataLoaded){
			this.service.getDraft()
						.success((draft) => {
							this.draft = draft;
							this.setState({content: draft.text, title: draft.title, dataLoaded: true});
						})
						.error((err) => {
							console.log(err);
							this.setState({content: err, title: null, dataLoaded: true});
						});
		}
	}

	componentWillUnmount() {
		//Autosave the Draft

  	}


	render() {

		const {content, readonly} = this.props;

		if (!this.state.dataLoaded) {
			return (<div> Loading .... </div>);
		}

		return (

		<div className="row padding-0 margin-0">
			{ !readonly && 
			<div className="col-md-12"> 
				<div className="col-md-8">
		    		<UserCard />
		    	</div>

		    	<div className="col-md-4 margin-top-20">
		    		<button className="btn btn-round btn-outline btn-primary" onClick={this.save}>Save</button>
		    		<button className="btn btn-round btn-outline btn-primary margin-left-20" onClick={this.publish}>Publish</button>
		    	</div>
	    	</div>
	    	}
	    	<div className="col-md-12">
	    		<h1 style={{width: "100%"}}>
	    			<input type="text" readOnly={readonly} name="title" value={this.state.title} style={{ border: "0", outline: "none", width: "100%" }} placeholder="Title" onChange={this.updateTitle}/>
	    		</h1>
	    	</div>
			<div className="col-md-12" style={{position:"inherit"}}>
				<div id="outer">
					<div id="inner">
						<RichEditor content={this.state.content} readonly={readonly} update={this.update}/>
					</div>
				</div>
			</div>
			
		</div>

		);
	}
}

const UserCard = () => {
	return (
		<div className="media" style={{padding: "10px 0px 10px 0px"}}>
          <div className="media-left">
            <div className="avatar avatar-busy">
              <img src="assets/images/avatar-1-small.jpg" alt="..."/>
            </div>
          </div>
          <div className="media-body">
            <h4 className="media-heading">
              Rambabu Ravuri
            </h4>
            <p className="comment-meta" style={{marginLeft: "0px"}}>
               Teacher at Delhi Public School on Class 2N, Environmental Sciences <br/>
               Oct 26, 2016 . 10 min read
            </p>
          </div>

        </div>
		);
}