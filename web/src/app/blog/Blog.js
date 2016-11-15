'use strict';

import React, {Component} from 'react';
import RichEditor from '../shared/rte/RichEditor';

export default class Blog extends React.Component {


	constructor(props) {

		super(props);

		this.state = {
			content: this.props.content,
		};

		this.update = (content) => {
			this.setState({
				content: content
			});
		}

		this.save = () => {
			console.log('save');
		}


		this.publish = () => {
			console.log('publish');
		}

		this.logChange = (val) => {
		    console.log("Selected: " + val);
		}
	}


	
	render() {
		return (

		<div className="row padding-0 margin-0">
			<div className="col-md-8">
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
	    	</div>

	    	<div className="col-md-4 margin-top-20">
	    		<button className="btn btn-round btn-outline btn-primary" onClick={this.save}>Save</button>
	    		<button className="btn btn-round btn-outline btn-primary margin-left-20" onClick={this.publish}>Publish</button>
	    	</div>
	    	<div className="col-md-12">
	    		<h1 style={{width: "100%"}}><input type="text" name="title" style={{ border: "0", outline: "none", width: "100%" }} placeholder="Title" /></h1>
	    	</div>
			<div className="col-md-12" style={{position:"inherit", marginTop:"20px"}}>
				<div id="outer">
					<div id="inner" style={{minHeight: "500px"}}>
						<RichEditor {...this.props}/>
					</div>
				</div>
			</div>
			
		</div>

		);

	}


}