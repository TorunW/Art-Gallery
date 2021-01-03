import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './file-uploader.css';
import Dropzone from 'react-dropzone';

function FileUpload(props) {
    const [file, setFile] = useState(''); // storing the uploaded file    // storing the recived file from backend
    const [data, getFile] = useState({ name: "", path: "" });
    const [progress, setProgress] = useState(0); // progess bar

    const el = useRef(); // accesing input element

    useEffect(()=> {
        if (file !== '') uploadFile()
    },[file])

    const handleChange = (e) => {
        setProgress(0)
        const file = e.target.files[0]; // accesing file
        console.log(file);
        setFile(file); // storing file
    }

    function handleDropUploader(files) {
        setProgress(0)
        const file = files[0]
        console.log(file)
        setFile(file)
    }

    const uploadFile = () => {
        const formData = new FormData();
        formData.append('file', file); // appending file
        axios.post('http://localhost:80/upload', formData, {
            onUploadProgress: (ProgressEvent) => {
                let progress = Math.round(
                ProgressEvent.loaded / ProgressEvent.total * 100);
                setProgress(progress);
            }
        }).then(res => {
            console.log(res);
            getFile({ name: res.data.name,
                     path: "http://localhost:80" + res.data.path
                   })
            props.updateInput(res.data.path)
        }).catch(err => console.log(err))}
        
    let buttonDisplay;
    if (file !== '') {
        buttonDisplay = (
            <button onClick={uploadFile} className="ui blue button upbutton">
                Upload
            </button>
        )
    }

    let progressBarClassNames = 'ui progress progress-bar';
    if (progress > 0 && progress < 100) progressBarClassNames = 'ui active progress progress-bar';
    else if (progress === 100) progressBarClassNames += ' success';

    return (
        <div id="file-upload-container">
            <div className="file-upload">
            <Dropzone onDrop={acceptedFiles => handleDropUploader(acceptedFiles)}>
                {({getRootProps, getInputProps}) => (
                    <div id="inner-drop-zone" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>
                            <div className={"inner-inner-drop-zone" + (file !== '' ? ' with-img' : '')}>
                                <i className="plus big icon"></i>
                                <hr/>
                                <span>Dra bild hit för att lägga till, eller klicka på plus ikonen</span>
                            </div>
                            <div className="uploaded-img">
                                {/* displaying received image*/}
                                {data.path && <img src={data.path} alt={data.name} />}
                            </div>
                        </p> 
                    </div>
                                    )}
            </Dropzone>
                <div className={progressBarClassNames} style={{ width: "100%" }}>
                    <div className="bar" style={{ width: progress + '%', minWidth: "0px" }}></div>
                </div>
            </div>
        </div>
    );
}




export default FileUpload;

/*
<Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
  {({getRootProps, getInputProps}) => (
    <section>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
    </section>
  )}
</Dropzone> */