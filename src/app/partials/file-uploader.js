import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './file-uploader.css';
import Dropzone from 'react-dropzone';

function FileUpload(props) {
    const [file, setFile] = useState(''); // storing the uploaded file    // storing the recived file from backend
    let initData = { name: "", path: "" };
    if (props.existingImg) initData.path = props.existingImg;
    const [data, getFile] = useState(initData);
    const [progress, setProgress] = useState(0); // progess bar
    const [imgMarginTop, setImgMarginTop] = useState(0);
    const [showImg, setShowImg] = useState(false);

    const el = useRef(); // accesing input element

    useEffect(()=> { 
        if (file !== '') uploadFile()
    },[file])

    function handleDropUploader(files) {
        setProgress(0)
        const file = files[0]
        setFile(file)
    }

    function onUploadedImgLoad(e) {
        const parentDivHeight = document.getElementById('inner-drop-zone').offsetHeight
        const imgHeight = e.target.clientHeight
        const newImgMarginTop = (parentDivHeight - imgHeight) / 2;
        setImgMarginTop(newImgMarginTop)
        setShowImg(true)
    } 

    const uploadFile = () => {
        const formData = new FormData();
        formData.append('file', file); // appending file
        axios.post('/upload', formData, {
            onUploadProgress: (ProgressEvent) => {
                let progress = Math.round(
                ProgressEvent.loaded / ProgressEvent.total * 100);
                setProgress(progress);
            }
        }).then(res => {
            getFile({ name: res.data.name,
                     path: "/" + res.data.path
                   })
            props.updateInput(res.data.path)
        }).catch(err => console.log(err))}
        
    let instructionContainerDisplay;
    if (file === '' && !data.path) {
        instructionContainerDisplay = (
            <div className="instruction-container">
                <i className="plus big icon"></i>
                <hr/>
                <span>Dra bild hit för att lägga till, eller klicka på plus ikonen</span>
            </div> 
        )
    }

    let progressBarClassNames = 'ui progress progress-bar';
    if (progress > 0 && progress < 100) progressBarClassNames = 'ui active progress progress-bar';
    else if (progress === 100) progressBarClassNames += ' success';

    return (
        <div id="file-upload-container">

            <Dropzone onDrop={acceptedFiles => handleDropUploader(acceptedFiles)}>
                {({getRootProps, getInputProps}) => (
                    <div id="inner-drop-zone" {...getRootProps()}>
                        <input {...getInputProps()} accept='image/*'/>
                        {instructionContainerDisplay}
                        <div className="uploaded-img">
                            {data.path && 
                                <img src={data.path} 
                                alt={data.name} 
                                style={{marginTop:imgMarginTop + 'px', opacity:(showImg === true ? '1':'0')}} 
                                onLoad={e=>onUploadedImgLoad(e)}/>
                            }
                        </div>
                    </div>                    
                )}
            </Dropzone>
            <div className={progressBarClassNames} style={{ width: "100%" }}>
                <div className="bar" style={{ width: progress + '%', minWidth: "0px" }}></div>
            </div>
        </div>
    );
}

export default FileUpload;