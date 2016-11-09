'use strict';

import {EditorState, RichUtils, convertToRaw, convertFromRaw, getVisibleSelectionRect} from 'draft-js';
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import React, {Component} from 'react';
import Editor, {createEditorStateWithText} from 'draft-js-plugins-editor';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import createImagePlugin, {imageCreator, imageStyles} from 'draft-js-image-plugin';

export default class RichEditor extends React.Component {

    constructor(props) {

        super(props);

        this.emojiPlugin = createEmojiPlugin();
        this.imagePlugin = createImagePlugin();

        if (this.props.content) {
            this.state = {
                editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.content)))
            };
        } else {
            this.state = {
                editorState: EditorState.createEmpty()
            };
        }

        this.focus = () => this.refs.editor.focus();
        this.onChange = (editorState) => this._onChange(editorState);
        //  this.props.update(JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())));
        this.handleKeyCommand = (command) => this._handleKeyCommand(command);
        this.onTab = (e) => this._onTab(e);
        this.toggleBlockType = (type) => this._toggleBlockType(type);
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);

        this.logState = () => {
            const content = this.state.editorState.getCurrentContent();
            console.log(convertToRaw(this.state.editorState.getCurrentContent()));
            console.log(this.state.position);
            console.log(this.state.sideToolbarPosition);
            const selection = this.state.editorState.getSelection();
            console.log(selection.serialize());
        };
    }

    _onChange(editorState) {

      let position = {
        transform: 'translate(-50%) scale(0)',
        visibility: 'hidden'
      };
      let sideToolbarPosition = {
        transform: 'translate(-50%) scale(0)',
        visibility: 'hidden'
      };
      const selection = editorState.getSelection();

      //Main toolbar position
      if (selection.getHasFocus() && !selection.isCollapsed()) {
        const selectionRect =  getVisibleSelectionRect(window) ;
        position = selectionRect ? {
         top: (selectionRect.top + window.scrollY) - 120,
         left: selectionRect.left + window.scrollX + (selectionRect.width / 2) - 140,
          transform: 'translate(-50%) scale(1)',
          transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
          visibility: 'visible'
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
              top: (top + window.scrollY) - 60,
              left: left + window.scrollX - 160,
              transform: 'scale(1)',
              transition: 'transform 0.15s cubic-bezier(.3,1.2,.2,1)',
              visibility: 'visible'
            }
          }

          this.setState({
            sideToolbarPosition : sideToolbarPosition
          });

      });

    }

    _handleKeyCommand(command) {
        const {editorState} = this.state;
        console.log('Handle Command: ' + command);
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

    _toggleBlockType(blockType) {
        this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
    }

    _toggleInlineStyle(inlineStyle) {
        this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle));
    }

    render() {
        const {editorState} = this.state;
        const {EmojiSuggestions} = this.emojiPlugin;

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
            }
            sideToolbar = <div style={this.state.sideToolbarPosition} className={toolbarClassname}>
              <button className="medium-editor-action medium-editor-action-bold medium-editor-button-first medium-editor-button-active" title="bold" ><b>B</b></button>
            </div>;

            var sideToolbarClassname = "medium-editor-toolbar medium-editor-stalker-toolbar medium-toolbar-arrow-under";
            if (this.state.position){
              sideToolbarClassname += ' medium-editor-toolbar-active';
            }
            toolbar = <div style={this.state.position} className={sideToolbarClassname}>
                <BlockStyleControls editorState={editorState} onToggle={this.toggleBlockType}/>
            </div>;
        }

        return (
            <div className="RichEditor-root">
                <input onClick={this.logState} type="button" value="Log State"/>
                {toolbar}
                <div className={className} onClick={this.focus}>
                    <Editor blockStyleFn={getBlockStyle} customStyleMap={styleMap} editorState={editorState} handleKeyCommand={this.handleKeyCommand} onChange={this.onChange}
                      onTab={this.onTab} placeholder="Type here..." ref="editor" spellCheck={true} readOnly={this.props.readonly}
                      plugins={[this.emojiPlugin]}/>
                </div>
                <EmojiSuggestions/>

                {sideToolbar}
            </div>
        );
    }
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
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-button';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <li onMouseDown={this.onToggle}>
                <button className="medium-editor-action medium-editor-action-bold medium-editor-button-first medium-editor-button-active" >
                  <b>{this.props.label}</b>
                </button>
            </li>
        );
    }
}

const BLOCK_TYPES = [
  {
        label: 'H2',
        style: 'header-two'
    }
    , {
        label: 'H3',
        style: 'header-three'
    }
    , {
        label: '"',
        style: 'blockquote'
    }, {
        label: 'UL',
        style: 'unordered-list-item'
    }
    , {
        label: 'OL',
        style: 'ordered-list-item'
    }
];

const BlockStyleControls = (props) => {
    const {editorState} = props;
    const selection = editorState.getSelection();
    const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
    var currentStyle = props.editorState.getCurrentInlineStyle();

    return (
        <ul className="medium-editor-toolbar-actions" style={ {display:'inline-block'} }>
            {BLOCK_TYPES.map((type) =>
              <StyleButton key={type.label} active={type.style === blockType} label={type.label} onToggle={props.onToggle} style={type.style}/>)}
            {INLINE_STYLES.map(type => <StyleButton key={type.label} active={currentStyle.has(type.style)} label={type.label} onToggle={props.onToggle} style={type.style}/>)}

        </ul>
    );
};

var INLINE_STYLES = [
    {
        label: 'B',
        style: 'BOLD'
    }, {
        label: 'I',
        style: 'ITALIC'
    }
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <ul className="medium-editor-toolbar-actions">
            {INLINE_STYLES.map(type => <StyleButton key={type.label} active={currentStyle.has(type.style)} label={type.label} onToggle={props.onToggle} style={type.style}/>)}
        </ul>
    );
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
