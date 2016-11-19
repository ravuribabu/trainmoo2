
import React, {Component} from 'react';
import {Modal, Header, Button, Popover, Tooltip, Overlay, OverlayTrigger, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
const $ = window.$;


export default class Toolbar extends React.Component  {

  constructor(props) {
    super(props);
  }

  render() {
      
      const {editorState} = this.props;
      const selection = editorState.getSelection();
      const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
      var currentStyle = editorState.getCurrentInlineStyle();

      return (
        <ul  style={ {display:'inline-block'} }>
            {BLOCK_TYPES.map((type) =>
              <ToolbarButton key={type.style} active={type.style === blockType} type={'block'} onToggle={this.props.onToggle} style={type.style}  element={type.element} />)}
            {INLINE_STYLES.map(type =>
              <ToolbarButton key={type.style} active={currentStyle.has(type.style)} type={'inline'} onToggle={this.props.onToggle} style={type.style}  element={type.element}/>)}
            <LinkToolbarButton onToggle={this.props.onToggle}/>
            <MediaToolbar {...this.props}/>
        </ul>
     );
  }
  
}


class ToolbarButton extends React.Component {

    constructor(props) {
        super(props);
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.type,this.props.style);
        };
    }

    render() {
        let className = '';
        if (this.props.active) {
          className = 'medium-editor-button-active'
        }
        return (
            <li onMouseDown={this.onToggle}>
                <button style={styles.toolbarButton}  className={className}>
                  {this.props.element}
                </button>
            </li>
        );
    }
}

var INLINE_STYLES = [
    {
        style: 'BOLD',
        element: <i className="fa fa-bold"></i>,
    }, {
        style: 'ITALIC',
        element: <i className="fa fa-italic"></i>,
    }
    , {
        style: 'UNDERLINE',
        element: <i className="fa fa-underline"></i>,
    }
];


const BLOCK_TYPES = [
  {
        style: 'header-two',
        element: <i className="fa fa-header"><sup>2</sup></i>,
    }
    , {
        style: 'header-three',
        element: <i className="fa fa-header"><sup>3</sup></i>,
    }
    , {
        style: 'blockquote',
        element: <i className="fa fa-paragraph"></i>,
    }, {
        style: 'unordered-list-item',
        element: <i className="fa fa-list-ul"></i>,
    }
    , {
        style: 'ordered-list-item',
        element: <i className="fa fa-list-ol"></i>,
    }
];


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


class MediaToolbar extends React.Component {

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
        this.onMediaSubmit = (e) => {
          e.preventDefault();
          this.setState({
            showModal: false,
          });


          setTimeout(() => this.props.onToggle(this.state.type, 
              {
                link: this.state.value,
                caption: this.state.caption,
              }
            ), 1000 );
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

            <ul  style={ {display:'inline-block'} }>
              <li>
                <button style={styles.toolbarButton}  onClick={() => this.showModal('image')} ><i className="fa wb-image"></i></button>
              </li>
              <li>
                <button style={styles.toolbarButton}  onClick={() => this.showModal('video')} ><i className="fa fa-youtube"></i></button>
              </li>
              <li>
                <button style={styles.toolbarButton} onClick={() => this.showModal('image', true)} ><i className="fa fa-upload"></i></button>
              </li>
              <Modal show={this.state.showModal} onHide={this.closeModal}>
                <form  onSubmit={this.onMediaSubmit}>
                  <Modal.Header closeButton>
                    <Modal.Title>Media Content</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
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
                  </Modal.Body>
                  <Modal.Footer>
                    <Button type="submit">Add</Button>
                  </Modal.Footer>
                </form>
              </Modal>
          </ul>
        );
    }

}


class LinkToolbarButton extends React.Component {

  constructor(props){
    super(props);
    this.state = {showModal: false, value:''};

    this.onClick = () => {
      this.setState({showModal:true});
    };
    this.onLinkSubmit = (e) => {
      e.preventDefault();
      this.setState({showModal:false});
      setTimeout(() => {
        this.props.onToggle('link', this.state.value);
      }, 100);
    };
    this.updateLink = (e) => {
      this.setState({value: e.target.value});
    };
  }


  render(){

    return (
        <li onMouseDown={this.onClick}>
            <button style={styles.toolbarButton}><i className="fa fa-link"></i></button>
            <Modal show={this.state.showModal} onHide={this.closeModal}>
              <form onSubmit={this.onLinkSubmit}>
                <Modal.Header closeButton>
                  <Modal.Title>Media Content</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormGroup
                      controlId="formBasicText"
                    >
                    <FormControl
                                type="text"
                                value={this.state.value}
                                placeholder="Enter youtube link"
                                onChange={this.updateLink}
                                style={{marginTop: "20px"}}
                              />

                    </FormGroup>
                </Modal.Body>
                <Modal.Footer>
                  <button type="submit" className="btn btn-primary" >Add</button>
                </Modal.Footer>
              </form>
            </Modal>
        </li>
    );
  }

}



const styles = {

  toolbarButton: {
    border: 'none',
    borderRadius: 2,
    cursor: 'pointer',
    display: 'inline-block',
    position: 'relative',
  } 
};


