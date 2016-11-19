'use strict';

import {Editor, EditorState, ContentState, RichUtils, Entity, convertToRaw, convertFromRaw, convertFromHTML, getVisibleSelectionRect, AtomicBlockUtils, CompositeDecorator} from 'draft-js';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import React, {Component} from 'react';
import MediaControl from './MediaControl'
import {Modal, Header, Button, Popover, Tooltip, Overlay, OverlayTrigger, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';

export default class RichEditor extends React.Component {

    constructor(props) {

        super(props);

       const decorator = new CompositeDecorator([
          {
            strategy: findLinkEntities,
            component: Link,
          }
        ]);


        if (this.props.content) {
            this.state = {
                editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.content)), decorator),
            };
        } else {
            this.state = {
                editorState: EditorState.createEmpty(decorator)
            };
        }

        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) => this._onChange(editorState);
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.onToggle = (e, t) => this._onToggle(e, t);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

        this.logState = () => {
            const content = this.state.editorState.getCurrentContent();
            console.log(convertToRaw(this.state.editorState.getCurrentContent()));
        };

        this.insertImage = (media) => this._insertImage(media);

        this.insertLink = (urlValue) => {
          console.log('Inserting link' + urlValue);
          const {editorState} = this.state;
          const entityKey = Entity.create('LINK', 'MUTABLE', {url: urlValue});
          this.setState({editorState: RichUtils.toggleLink(editorState, editorState.getSelection(), entityKey) }, () => {
                      setTimeout(() => this.refs.editor.focus(), 100);
                    });
        };

        this.unlink = () => {
          const {editorState} = this.state;
          const selection = editorState.getSelection();
          if (!selection.isCollapsed()) {
            this.setState({
              editorState: RichUtils.toggleLink(editorState, selection, null),
            });
          }
        };


        this.handlePastedText = (text, html) => {
          console.log("TEXT: " + text);
          console.log("HTML: " + html);
          return 'not-handled';
        }; 

    }

    _onChange(editorState) {

      let position = {
        transform: 'translate(-50%) scale(0)',
        visibility: 'hidden',
        height: '52px'
      };
      let sideToolbarPosition = {
        transform: 'translate(-50%) scale(0)',
        visibility: 'hidden',
        position: 'absolute'
      };
      const selection = editorState.getSelection();

      //Main toolbar position
      if (selection.getHasFocus() && !selection.isCollapsed()) {
        const selectionRect =  getVisibleSelectionRect(window) ;
        position = selectionRect ? {
         top: (selectionRect.top + window.scrollY) - 140,
         left: selectionRect.left + window.scrollX + (selectionRect.width / 2) - 544,
          transform: 'translate(-50%) scale(1)',
          transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
          visibility: 'visible',
          height: '52px'
        } : {
          transform: 'translate(-50%) scale(0)',
        };
      }

      this.setState({
        editorState: editorState,
        position: position,
      });


      //Side Toolbar position
      const currentContent = editorState.getCurrentContent();
      const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
      setTimeout(() => {
        if (selection.getHasFocus() && currentBlock.getLength() <= 0) {

          const offsetKey = DraftOffsetKey.encode(currentBlock.getKey(), 0, 0);

          const selectionRect =  getVisibleSelectionRect(window) ;
          const node = document.querySelectorAll(`[data-offset-key="${offsetKey}"]`)[0];
          const top = node.getBoundingClientRect().top;
          const left = node.getBoundingClientRect().left;

          sideToolbarPosition = {
              top: (top + window.scrollY) - 80,
              left: left + window.scrollX - 340,
              transform: 'scale(1)',
              transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
              visibility: 'visible',
              position: 'absolute'
            }
          }

          this.setState({
            sideToolbarPosition : sideToolbarPosition
          });

      });

      
      if(!this.props.readonly) {
        if (editorState.getCurrentContent().hasText() && editorState.getCurrentContent().getPlainText(' ').trim().length > 0) {
          this.props.update(JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())));
        } else {
          this.props.update(undefined);
        }
      }

      
    }

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }

    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }

    _onToggle(style, type){
      if (type === 'block'){
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, style));
      } else {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, style));
      }
    }
    _toggleBlockType(blockType) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }

    _insertImage(media) {
      if (!media || !media.link) {
        return;
      }

      const entityKey = Entity.create(media.type, 'IMMUTABLE', {src: media});
      this.setState({
        editorState: AtomicBlockUtils.insertAtomicBlock(this.state.editorState, entityKey, ' ')
        }, () => {
        setTimeout(() => this.focus(), 0);
      });
    }

    render() {
        const {editorState} = this.state;
        // const {EmojiSuggestions} = this.emojiPlugin;

        // If the user changes block type before entering any text, we can
        // either style the placeholder or hide it. Let's just hide it now.
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }

        if (this.props.readonly) {
            className = 'RichEditor-editor-readonly';
        }

        var toolbar = '';
        var sideToolbar = '';
        if (!this.props.readonly) {
            var toolbarClassname = "medium-editor-toolbar medium-editor-stalker-toolbar medium-toolbar-arrow-under";
            if (this.state.sideToolbarPosition){
              toolbarClassname += ' medium-editor-toolbar-active';

              sideToolbar = 
                          <div style={this.state.sideToolbarPosition}>
                            <MediaControl onCloseReturn={this.insertImage}/>
                          </div>;
            }
            

            var sideToolbarClassname = "medium-editor-toolbar medium-editor-stalker-toolbar medium-toolbar-arrow-under";
            if (this.state.position){
              sideToolbarClassname += ' medium-editor-toolbar-active';
            }
            toolbar = <div style={this.state.position} className={sideToolbarClassname}>
                <BlockStyleControls editorState={editorState} onToggle={this.onToggle} insertLink={this.insertLink} unlink={this.unlink}/>
            </div>;
        }

        return (
            <div className="RichEditor-root">
                <div className={className} onClick={this.focus}>
                    <Editor blockRendererFn={mediaBlockRenderer}
                            blockStyleFn={getBlockStyle} 
                            customStyleMap={styleMap} 
                            editorState={editorState} 
                            handleKeyCommand={this.handleKeyCommand} 
                            onChange={this.onChange}
                            onTab={this.onTab} 
                            placeholder="Type here..." 
                            ref="editor" 
                            spellCheck={true} 
                            readOnly={this.props.readonly}
                            handlePastedText={this.handlePastedText}
                            />
                </div>
                {/*<EmojiSuggestions/>*/}
                {toolbar}
                {sideToolbar}
                {/* <input onClick={this.logState} type="button" value="Log State"/> */}
            </div>
        );
    }
}


function findLinkEntities(contentBlock, callback) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        Entity.get(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

const Link = (props) => {
  const {url} = Entity.get(props.entityKey).getData();
  const tooltip = 
                   (<Tooltip id="toltip-link">
                      {url}
                    </Tooltip>);
  return (
    <OverlayTrigger overlay={tooltip} placement="top">
      <a target="_blank" href={url} style={styles.link} >
        {props.children}
      </a>
    </OverlayTrigger>
  );
};


function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }
  return null;
}


const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2
    }
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
}



class StyleButton extends React.Component {

    constructor(props) {
        super(props);
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style, this.props.type);
        };
    }

    render() {
        let className = 'medium-editor-action medium-editor-action-bold medium-editor-button-first';
        if (this.props.active) {
            className += ' medium-editor-button-active';
        }

        return (
            <li onMouseDown={this.onToggle}>
                <button className={className}>
                  {this.props.element}
                </button>
            </li>
        );
    }

}


class UnlinkStyleButton extends React.Component {
  

  constructor(props){
    super(props);
  }

  render(){
    let className = 'medium-editor-action medium-editor-action-bold medium-editor-button-first';
    if (this.props.active) {
          className += ' medium-editor-button-active';
      }
    return (
        <li onMouseDown={this.props.onClick}>
            <button className={className}><i className="fa fa-link"></i></button>
        </li>
      );
  }
}

class LinkStyleButton extends React.Component {

  constructor(props){
    super(props);
    this.state = {showModal: false, value:''};

    this.onClick = () => {
      this.setState({showModal:true});
    };
    this.closeModal = () => {
      console.log('Closing modal');
      console.log('Link entered: ' + this.state.value);
      this.props.insertLink(this.state.value);
      this.setState({showModal:false});
    };
    this.updateLink = (e) => {
      console.log('update link');
      this.setState({value: e.target.value});
    };
  }


  render(){
    let className = 'medium-editor-action medium-editor-action-bold medium-editor-button-first';
    if (this.props.active) {
          className += ' medium-editor-button-active';
      }

    return (
        <li onMouseDown={this.onClick}>
            <button className={className}><i className="fa fa-link"></i></button>
            <Modal show={this.state.showModal} onHide={this.closeModal}>
              <Modal.Header closeButton>
                <Modal.Title>Media Content</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form>
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
                </form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeModal}>Add</Button>
              </Modal.Footer>
            </Modal>
        </li>
    );
  }

}

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    var currentStyle = editorState.getCurrentInlineStyle();

    return (
        <ul className="medium-editor-toolbar-actions" style={ {display:'inline-block'} }>
            {BLOCK_TYPES.map((type) =>
              <StyleButton key={type.label} active={type.style === blockType} type={'block'} onToggle={props.onToggle} style={type.style}  element={type.element} />)}
            {INLINE_STYLES.map(type =>
              <StyleButton key={type.label} active={currentStyle.has(type.style)} type={'inline'} onToggle={props.onToggle} style={type.style}  element={type.element}/>)}

            <LinkStyleButton insertLink={props.insertLink}/>
            <UnlinkStyleButton onClick={props.unlink} />
        </ul>
    );
};

const Audio = (props) => {
  return <audio controls src={props.src} style={styles.media} />;
};

const Image = (props) => {
  return (
    <figure style={{ display: 'block', textAlign: 'center'}}>
      <img src={props.src.link} style={{ display: 'inline-block'}} className="img-responsive"/>
      <figcaption style={{ textAlign: 'center'}} className="text-small">{props.src.caption}</figcaption>
    </figure>
    );
};

const Video = (props) => {
  return  (   
  <figure style={{ display: 'block', textAlign: 'center'}}>
      <iframe width="560" height="315" src={props.src.link} style={{ display: 'inline-block', border: 'none'}}></iframe>
      <figcaption style={{ textAlign: 'center'}} className="text-small">{props.src.caption}</figcaption>
  </figure> );
};

const Media = (props) => {

  if (!props.block.getEntityAt(0)) {
    return <div>{props.children}</div>;
  }

  const entity = Entity.get(props.block.getEntityAt(0));
  const {src} = entity.getData();
  const type = entity.getType();

  let media;
  if (type === 'audio') {
    media = <Audio src={src} />;
  } else if (type === 'image') {
    media = <Image src={src} />;
  } else if (type === 'video') {
    media = <Video src={src} />;
  } 

  return media;
};


var INLINE_STYLES = [
    {
        label: 'B',
        style: 'BOLD',
        element: <i className="fa fa-bold"></i>,
        type: 'inline'
    }, {
        label: 'I',
        style: 'ITALIC',
        element: <i className="fa fa-italic"></i>,
        type: 'inline'
    }
    , {
        label: 'U',
        style: 'UNDERLINE',
        element: <i className="fa fa-underline"></i>,
        type: 'inline'
    }
];




const BLOCK_TYPES = [
  {
        label: 'H2',
        style: 'header-two',
        element: <i className="fa fa-header"><sup>2</sup></i>,
        type: 'block'
    }
    , {
        label: 'H3',
        style: 'header-three',
        element: <i className="fa fa-header"><sup>3</sup></i>,
        type: 'block'
    }
    , {
        label: '"',
        style: 'blockquote',
        element: <i className="fa fa-paragraph"></i>,
        type: 'block'
    }, {
        label: 'UL',
        style: 'unordered-list-item',
        element: <i className="fa fa-list-ul"></i>,
        type: 'block'
    }
    , {
        label: 'OL',
        style: 'ordered-list-item',
        element: <i className="fa fa-list-ol"></i>,
        type: 'block'
    }
];

const styles = {
    root: {
        fontFamily: '\'Georgia\', serif',
        padding: 20,
        width: 600
    },
    buttons: {
        marginBottom: 10
    },
    urlInputContainer: {
        marginBottom: 10
    },
    urlInput: {
        fontFamily: '\'Georgia\', serif',
        marginRight: 10,
        padding: 3
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 80,
        padding: 10
    },
    button: {
        marginTop: 10,
        textAlign: 'center'
    },
    link: {
        color: '#3b5998',
        textDecoration: 'underline'
    }
};
