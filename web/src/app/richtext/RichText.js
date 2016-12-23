'use strict';

import React, {Component} from 'react';
import RichEditor from '../shared/rte/RichEditor';
import ReactDOM from 'react-dom';
import {Editor, EditorState, ContentState, RichUtils, Entity, convertToRaw, convertFromRaw, convertFromHTML, getVisibleSelectionRect, AtomicBlockUtils, CompositeDecorator} from 'draft-js';
import {Modal, Header, Button, Popover, Tooltip, Overlay, OverlayTrigger, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';


export default class RichText extends React.Component {

	constructor(props) {

		super(props);

		this.service = this.props.service;
		this.state = { dataLoaded : false }
		let autosaveInprogress = false;
		
		this.update = (content) => {
			
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
		}

		this.save = () => {
			this.props.onCancel();
		}


		this.autosave = () => {
			
			this.draft.text = this.state.content;
			this.draft.title = this.state.title;

			
			this.draft.previewImg = this.editor.previewImage();
			this.draft.previewText = this.editor.previewText();
		
			
			this.service.updateRichtext(this.draft)
						.success((data) => {
							console.log('Richtext saved successfully!');
						})
						.error((err) => {
							console.log(err);
						});
		}
		
		this.publish = () => {
			this.autosave();
			this.props.onPublish();			
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

			if (!this.props.richtextid ) {
				this.service.getDraft()
							.success((draft) => {
								this.draft = draft;
								this.setState({content: draft.text, title: draft.title, dataLoaded: true});
							})
							.error((err) => {
								console.log(err);
								this.setState({content: err, title: null, dataLoaded: true});
							});
			} else {
				this.service.getRichText(this.props.richtextid)
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
	}

	componentWillUnmount() {
		//Autosave the Draft

  	}


	render() {

		const {content, readonly} = this.props;

		if (!this.state.dataLoaded) {
			return (<div> Loading .... </div>);
		}

		const saveTooltip = (
		  <Tooltip id="tooltip">Save the draft & exit.</Tooltip>
		);

		const publishTooltip = (
		  <Tooltip id="tooltip">Publish the draft.</Tooltip>
		);

		return (

		<div className="row padding-0 margin-0">
			{ !readonly && 
			<div className="col-md-12"> 
				<div className="col-md-8">
		    		<UserCard />
		    	</div>

		    	<div className="col-md-4 margin-top-20">
		    		<OverlayTrigger placement="top" overlay={saveTooltip}>
		    			<button className="btn btn-raised  btn-default" onClick={this.save}>Save</button>
		    		</OverlayTrigger>
		    		<OverlayTrigger placement="top" overlay={publishTooltip}>
		    			<button className="btn btn-raised  btn-primary margin-left-20" onClick={this.publish}>Publish</button>
		    		</OverlayTrigger>
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
						 <RichEditor ref={(editor) => {this.editor = editor;}} content={this.state.content} readonly={readonly} update={this.update}/>
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