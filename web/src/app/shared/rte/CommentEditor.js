import {EditorState, ContentState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'; 
import createEmojiPlugin from 'draft-js-emoji-plugin'; 
import mentions from './mentions';
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';

export default class CommentEditor extends React.Component {

  constructor(props) {
    super(props);

    this.emojiPlugin = createEmojiPlugin();
    this.mentionPlugin = createMentionPlugin();

    if (this.props.content){
      this.state = {
        editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.content))),
        suggestions: mentions,
        selected: false
      };
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
        suggestions: mentions,
        selected: false
      };
    } 

    this.onSearchChange = ({ value }) => {
      this.setState({
        suggestions: defaultSuggestionsFilter(value, mentions),
      });
    };


    this.onChange = (editorState) => { 
      
               
      if(!this.props.readonly) {
        if (editorState.getCurrentContent().hasText() && editorState.getCurrentContent().getPlainText(' ').trim().length > 0) {
          this.props.update(JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())));
        } else {
          this.props.update(undefined);
        }
      }

      let {selected} = this.state;

      if (!selected) {
        const selectionState = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        if (selectionState.hasFocus || contentState.hasText()) {
          selected = true;
          this.props.onSelect();
        } else {
          selected = false;
        }
      }

      this.setState({
        editorState,
        selected
      });

    };

    this.reset = (e) => {
      const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
      this.setState({
        editorState: editorState,
        suggestions: mentions,
        selected: false
      });
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


  render() {
    const {editorState, selected} = this.state;
    const {readonly} = this.props;
    const { EmojiSuggestions } = this.emojiPlugin;
    const { MentionSuggestions } = this.mentionPlugin;

    let className = 'CommentEditor-editor';

    let editorStyle = {}
    if (readonly){
      editorStyle.border = '0';
      editorStyle.padding = '0px';
    } else {
      editorStyle.height = (selected?'80px':'35px');
    }
    
    return (
      <div className="CommentEditor-root" style={editorStyle}>
        <div className={className} >
          <Editor
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder={this.props.placeholder}
            ref="editor"
            readOnly={this.props.readonly}
            plugins={[this.emojiPlugin, this.mentionPlugin]}
          />
          <EmojiSuggestions />
          <MentionSuggestions
              onSearchChange={this.onSearchChange}
              suggestions={this.state.suggestions}
            />
        </div>
    </div>
    );
  }
}




