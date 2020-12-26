import React, { useRef, useState } from 'react';
import axios from 'axios';
import './file-uploader.css';

function FileUpload(props) {
    const [file, setFile] = useState(''); // storing the uploaded file    // storing the recived file from backend
    const [data, getFile] = useState({ name: "", path: "" });
    const [progress, setProgess] = useState(0); // progess bar
    const el = useRef(); // accesing input element
    const handleChange = (e) => {
        setProgess(0)
        const file = e.target.files[0]; // accesing file
        console.log(file);
        setFile(file); // storing file
    }
    const uploadFile = () => {
        const formData = new FormData();
        formData.append('file', file); // appending file
        axios.post('http://localhost:8080/upload', formData, {
            onUploadProgress: (ProgressEvent) => {
                let progress = Math.round(
                ProgressEvent.loaded / ProgressEvent.total * 100) + '%';
                setProgess(progress);
            }
        }).then(res => {
            console.log(res);
            getFile({ name: res.data.name,
                     path: "http://localhost:8080" + res.data.path
                   })
            props.updateInput(res.data.path)
        }).catch(err => console.log(err))}

    return (
        <div id="file-upload-container">
            <div className="file-upload">
                <input type="file" ref={el} onChange={handleChange} />
                <div className="ui progress bar progessBar" style={{ width: progress }}>
                   {progress}
                </div>
                <button onClick={uploadFile} className="ui blue button upbutton">
                    Upload
                </button>
            <hr />
            {/* displaying received image*/}
            {data.path && <img src={data.path} alt={data.name} />}
            </div>
        </div>
    );
}
export default FileUpload;