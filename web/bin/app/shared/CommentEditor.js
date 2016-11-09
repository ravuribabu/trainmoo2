import {EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js';
import React, { Component } from 'react';
import Editor, { createEditorStateWithText } from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createEmojiPlugin from 'draft-js-emoji-plugin'; // eslint-disable-line import/no-unresolved


export default class CommentEditor extends React.Component {

        constructor(props) {
          super(props);

          this.emojiPlugin = createEmojiPlugin();
          

          let editorStyle = {}
          if (this.props.readonly) {
              editorStyle.border = '0';
          } else {
              editorStyle.height = '35px';
          }

          if (this.props.content){
            this.state = {
              editorState: EditorState.createWithContent(convertFromRaw(JSON.parse(this.props.content))),
              editorStyle :  editorStyle
            };
          } else {
            this.state = {
              editorState: EditorState.createEmpty(),
              editorStyle :  editorStyle
            };
          } 

          // this.state = {
          //   editorState: EditorState.createEmpty(),
          //   editorStyle :  {
          //     height: '30px'
          //   }
          // };

          this.focus = () => {
            this.refs.editor.focus();
            if (!this.props.readonly) {
              this.setState({
                editorStyle: {
                  height: '80px'
                }
              });
            }
            
          }

          this.onChange = (editorState) => { 
            this.setState({
              editorState
            });         
            if(!this.props.readonly && editorState.getCurrentContent().hasText()) {
              this.props.update(JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())));
            }
          };

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
          const {editorState} = this.state;
          const { EmojiSuggestions } = this.emojiPlugin;

          // If the user changes block type before entering any text, we can
          // either style the placeholder or hide it. Let's just hide it now.
          let className = 'CommentEditor-editor';
          var contentState = editorState.getCurrentContent();
          if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
              className += 'CommentEditor-hidePlaceholder';
            }
          }

          if (this.props.readonly) {
            className = 'CommentEditor-editor-readonly';
          }

          return (
            <div className="CommentEditor-root" style={this.state.editorStyle}>
              <div className={className} onClick={this.focus} >
                <Editor
                  editorState={editorState}
                  handleKeyCommand={this.handleKeyCommand}
                  onChange={this.onChange}
                  placeholder="Create new post..."
                  ref="editor"
                  readOnly={this.props.readonly}
                  plugins={[this.emojiPlugin]}
                />
                <EmojiSuggestions />
              </div>
            </div>
          );
        }
      }




