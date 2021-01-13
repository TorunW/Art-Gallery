import React, { Component, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

function TextEditor(props) {
    const initText = props.defaultValue !== null ? props.defaultValue : '<p></p>';
    const [text, setText] = useState(initText)
    
        return (
            <React.Fragment>
                <h2></h2>
                <CKEditor
                    editor={ ClassicEditor }
                    data={text}
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        const data = editor.getData();
                        props.updateInput(data)
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
            </React.Fragment>
        );
    
}
  
export default TextEditor;