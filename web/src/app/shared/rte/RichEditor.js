'use strict';

import {Editor, EditorState, ContentState, RichUtils, Entity, convertToRaw, convertFromRaw, convertFromHTML, getVisibleSelectionRect, AtomicBlockUtils, CompositeDecorator} from 'draft-js';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import React, {Component} from 'react';
import Toolbar from './MediaControl'
import {Modal, Header, Button, Popover, Tooltip, Overlay, OverlayTrigger, FormGroup, ControlLabel, FormControl, HelpBlock} from 'react-bootstrap';

export default class RichEditor extends React.Component {

    constructor(props) {

        super(props);

       this.decorator = new CompositeDecorator([
          {
            strategy: findLinkEntities,
            component: Link,
          }
        ]);


        if (this.props.content) {
            this.state = {
                editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.content)), this.decorator),
            };
        } else {
            this.state = {
                editorState: EditorState.createEmpty(this.decorator)
            };
        }

        this.focus = () => {
          this.refs.editor.focus()
        };
        this.onChange = (editorState) => this._onChange(editorState);
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.onToggle = (t, v) => this._onToggle(t, v);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

        this.logState = () => {
            const content = this.state.editorState.getCurrentContent();
            console.log(convertToRaw(this.state.editorState.getCurrentContent()));
            this.log();
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
          return 'not-handled';
        }; 

    }


    _onChange(editorState) {
      
      const selection = editorState.getSelection();

      //editorState = this.trim();
      if(!this.props.readonly) {
        if (editorState.getCurrentContent().hasText() && editorState.getCurrentContent().getPlainText(' ').trim().length > 0) {
          this.props.update(JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())), editorState.getCurrentContent());
        } else {
          this.props.update('');
        }
      }

      this.setState({ editorState: editorState });

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

    _onToggle( type, value){
      const {editorState} = this.state;
      switch (type) {
        case 'block': 
          this.onChange(RichUtils.toggleBlockType(editorState, value));
          break;
        case 'inline':
          this.onChange(RichUtils.toggleInlineStyle(editorState, value));
          break;

        case 'link':
          const entityKey = Entity.create('LINK', 'MUTABLE', {url: value});
          this.onChange(RichUtils.toggleLink(editorState, editorState.getSelection(), entityKey)) ;
          break;


        case 'image':
        case 'video':
          if (!value || !value.link) {
            return;
          }
          const entityKey1 = Entity.create(type, 'IMMUTABLE', {src: value});
          this.onChange(AtomicBlockUtils.insertAtomicBlock(this.state.editorState, entityKey1, ' '));
          break;

      }
    }


    _toggleBlockType(blockType) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }

    trim(){

      const {editorState} = this.state;
      const currentContent = editorState.getCurrentContent();
      const blocks = currentContent.getBlocksAsArray();
      let i = blocks.length - 1;
      for ( ; (i>=0) ; i--) {
        let block = blocks[i];
        if (!(block.getType() === 'unstyled' && block.getLength()<=0)) {
          break;
        }
      }

      if (i < blocks.length - 1) {
        return EditorState.createWithContent(ContentState.createFromBlockArray(blocks.slice(0, i + 1)), this.decorator);
      } 
      this.onChange(editorState);

      return editorState;
    
      

    }

    log() {
      const {editorState} = this.state;
      const currentContent = editorState.getCurrentContent();
      const blocks = currentContent.getBlocksAsArray();

      blocks.forEach((b) => {

        let noOfEntities = 0;
        for (let i=0; (i<b.getLength()) ; i++ ) {
          if (b.getEntityAt(i)) noOfEntities++;
        }
      })
    }

    previewImage() {
      
      const {editorState} = this.state;
      const currentContent = editorState.getCurrentContent();

      if (currentContent) {
        const imgs = currentContent
            .getBlocksAsArray()
            .filter(f => { return (f.getType() === 'atomic') } )
            .map((contentBlock) => {
               
              var images = contentBlock.getCharacterList()
                    .map((c) => {
                      const entityKey = c.getEntity();
                      if (entityKey){
                            const entity = Entity.get(entityKey);
                            if (entity.type === 'image') {
                              return entity.data.src.link;
                            }
                      }
                    });
              if (images && images.length > 0) {
                return images.get(0);
              }
            })
            .filter(x => {return x;});
  
  
        if (imgs && imgs.length > 0) {
          return imgs[0];
        }
      }

      return '';  
    }

    previewText(){

      const {editorState} = this.state;
      const currentContent = editorState.getCurrentContent();
      return currentContent?currentContent.getPlainText().replace(/\s\s+/g, ' ').replace(/\n/g, " ").substring(0, 200):'';
    
    }

    render() {
        const {editorState} = this.state;

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
        if (!this.props.readonly) {

            toolbar = <div  className="medium-editor-toolbar">

                <Toolbar editorState={editorState} onToggle={this.onToggle}/>

                { /*<BlockStyleControls editorState={editorState} onToggle={this.onToggle}  unlink={this.unlink}/> */ }
                { /* <MediaControl onCloseReturn={this.insertImage}/> */ }
            </div>;
        }

         let editorStyle = {};
        // if (!this.props.readonly){
        //   editorStyle = {height: '100px', overflowY: 'scroll'};
        // }

        return (
            <div className="RichEditor-root">
                <div className={className} onClick={this.focus}>
                    {toolbar}
                    <div style={editorStyle}>
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
                </div>
                {/*<EmojiSuggestions/>*/}
                { <input onClick={this.logState} type="button" value="Log State"/> }
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
  if (type === 'image') {
    media = <Image src={src} />;
  } else if (type === 'video') {
    media = <Video src={src} />;
  } 

  return media;
};



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

