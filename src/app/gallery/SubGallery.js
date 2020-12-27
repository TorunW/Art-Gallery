import React, { useEffect, useState, Suspense, lazy } from 'react';
import { SRLWrapper } from "simple-react-lightbox";
import {breakArrayIntoChunksHelper} from '../helpers';

function SubGallery(props) {

    const [pictures, setPictures] = useState([])
  
    useEffect(() => {
      getPictures()
    },[])
  
    function getPictures() {
      fetch('/pictures/' + props.pictureType)
      .then(res => res.text())
      .then(res =>{
        const newPictures = breakArrayIntoChunksHelper(2, JSON.parse(res))
        setPictures(newPictures);
      })
    }
  
    const galleryDisplay = pictures.map((subArray, subIndex) => (
        <SubGalleryRow key={subIndex} subArray={subArray}/>
    ))
  
    const options={
      thumbnails:{
        showThumbnails:false
      },
      buttons: {
        showDownloadButton: false
      }
    }
    
  
    return(
        <div className="sub-gallery">
          <SRLWrapper 
           options={options}>
            <div id="gallery-pictures">{galleryDisplay}</div>
          </SRLWrapper>
        </div>
    )
  }

  function SubGalleryRow(props) {
    
    const [hovered, setHovered] = useState(null)
    console.log(hovered);

    const SubGalleryPictureDisplay = props.subArray.map((picture, index) => (
        <SubGalleryPicture 
            key={index} 
            picture={picture}
            hovered={hovered}
            setHovered={setHovered}
        />
    ))  


    return(
        <div className="container">
            {SubGalleryPictureDisplay}
        </div>
    )
  }

  function SubGalleryPicture(props) {
    
    const picture = props.picture;

    let priceStyle = {};

    if (props.hovered !== null && props.hovered !== picture.picture_id) priceStyle = {display:'none'};

    return(
        <div className="box" 
          onMouseEnter={()=> props.setHovered(picture.picture_id)}
          onMouseLeave={()=> props.setHovered(null)}>
            <img src={picture.filename}/>
            <div className="ui grid my-grid">
                <div className="twelve wide column twelve-wide">
                    <h2>
                        {picture.caption}
                    </h2>
                    <p>
                        {picture.description}
                    </p>
                </div>
                <div className="four wide column four-wide">
                <span style={priceStyle}>
                    {picture.price.split("kr")[0]}
                    <span style={{marginLeft:"3px"}}>kr</span>
                </span>
                </div>
            </div>  
        </div>
    )
  }

  export default SubGallery;