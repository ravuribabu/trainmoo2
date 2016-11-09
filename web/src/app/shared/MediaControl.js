
import React, {Component} from 'react';
import {Modal, Header, Button, Popover, Tooltip, Overlay, OverlayTrigger, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
const $ = window.$;

export default class MediaControl extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
          value: '',
          caption: '',
          showModal: false
        };
        this.focus = () => this.refs.url.focus();
        this.onToggle = (e) => {
            e.preventDefault();
        };
        this.updateLink = (e) => {
          let value = e.target.value;
          if (this.state.type === 'video' && value.indexOf('embed') < 0){
            value = value.replace(/(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, 'www.youtube.com/embed/$1')
            
          }
          this.setState({ value: value });
        }

        this.updateCaption = (e) => {
          this.setState({ caption: e.target.value });
        }
        this.closeModal = () => {
          this.setState({
            showModal: false,
          });


          setTimeout(() => this.props.onCloseReturn(
              {
                link: this.state.value,
                caption: this.state.caption,
                type: this.state.type
              }
            ), 100 );
        }

        this.showModal = (type, upload) => {
          if (type){
            this.setState({
              showModal: true,
              type: type,
              value: '',
              caption: '',
              upload: upload
            });
          }
        }

        this.onDrop = (acceptedFiles, rejectedFiles) => {
          console.log('Accepted files: ', acceptedFiles);
          console.log('Rejected files: ', rejectedFiles);
          let fileid = '';
          var data = new FormData();
          $.each(acceptedFiles, function(key, value)
          {
              fileid = value.size + '-' + value.name.replace('.', '');
              data.append("file", value);
              data.append('flowChunkNumber', 1);
              data.append('flowChunkSize', value.size);
              data.append('flowCurrentChunkSize', value.size);
              data.append('flowTotalSize', value.size);
              data.append('flowIdentifier', fileid);
              data.append('flowFilename', value.name);
              data.append('flowRelativePath', value.name);
              data.append('flowTotalChunks', 1);
          });

          $.ajax({
                url: '/api/img/upload',
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function(data, textStatus, jqXHR)
                {
                    if(typeof data.error === 'undefined')
                    {
                        submitForm(event, data);
                    }
                    else
                    {
                        console.log('ERRORS: ' + data.error);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.log('ERRORS: ' + textStatus);
                }
            });

          this.setState({
            files: acceptedFiles,
            value: 'http://localhost:8080/api/img/download/' + fileid 
          });
        }

        this.onOpenClick= () => {
          this.dropzone.open();
        }

    }

    render() {
        let className = 'medium-editor-action medium-editor-action-bold medium-editor-button-first';
        if (this.props.active) {
            className += ' medium-editor-button-active';
        }

        let modalElement = '';

        if (this.state.showModal) {

          if (this.state.type === 'image') {

            if (this.state.upload) {
              modalElement = <div style={{display:'block', textAlign: 'center'}}>
                               <Dropzone onDrop={this.onDrop} multiple={false} ref={(node) => { this.dropzone = node; }} style={{display:'hidden'}}>
                               </Dropzone>
                              <button type="button" className="btn btn-primary btn-outline btn-round" onClick={this.onOpenClick}>
                                  Upload file
                              </button>
                              { 
                              (this.state.files && this.state.files.length > 0) ? 
                              <div style={{marginTop:'20px'}}>
                                {this.state.files.map((file) => <img src={file.preview} style={{height: '180px'}} className="img-responsove"/> )}
                              </div>
                              : null
                              }
                              </div>
              
            } else {
              modalElement = <FormControl
                              type="text"
                              value={this.state.value}
                              placeholder="Enter image link"
                              onChange={this.updateLink}
                              style={{marginTop: "20px"}}
                            />
            }
          }
          else if (this.state.type === 'video') {
            modalElement = <FormControl
                              type="text"
                              value={this.state.value}
                              placeholder="Enter youtube link"
                              onChange={this.updateLink}
                              style={{marginTop: "20px"}}
                            />
          }
          
        }

        return (
            <div style= { {display: 'block'} }>
              <button type="button" className="btn btn-floating btn-dark btn-sm" style= { {display: 'block', marginBottom: '10px'} }><i className="icon wb-plus" aria-hidden="true" ></i></button>
              <button type="button" className="btn btn-floating btn-dark btn-sm" style= { {display: 'block', marginBottom: '10px'} } onClick={() => this.showModal('image')} ><i className="icon wb-image" aria-hidden="true"></i></button>
              <button type="button" className="btn btn-floating btn-dark btn-sm" style= { {display: 'block', marginBottom: '10px'} } onClick={() => this.showModal('video')}><i className="icon fa-youtube" aria-hidden="true"></i></button>
              <button type="button" className="btn btn-floating btn-dark btn-sm" style= { {display: 'block', marginBottom: '10px'} } onClick={() => this.showModal('image', true)}><i className="icon fa-upload" aria-hidden="true"></i></button>

              <Modal show={this.state.showModal} onHide={this.closeModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Media Content</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form>
                    <FormGroup
                      controlId="formBasicText"
                    >
                      
                      {modalElement}

                      <FormControl
                        type="text"
                        value={this.state.caption}
                        placeholder="Enter caption"
                        onChange={this.updateCaption}
                        style={{marginTop: "20px"}}
                      />

                    </FormGroup>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.closeModal}>Add</Button>
                </Modal.Footer>
              </Modal>

            </div>
        );
    }

}
