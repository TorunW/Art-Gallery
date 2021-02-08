import React, { useEffect, useState } from 'react';
import './Gallery.css';
import { SRLWrapper } from "simple-react-lightbox";


function GallerySection(props) {
  const [pictures, setPictures] = useState([])
  const [ currentImgIndex, setCurrentImgIndex ] = useState(0)
  const [ isBlurred, setIsBlurred ] = useState(false); 
  
    useEffect(() => {
      getPictures()
    },[])

    function getPictures() {
      fetch('/pictures')
      .then(res => res.text())
      .then(res =>{
        setPictures(JSON.parse(res));
      })
    }
  
    const galleryDisplay = pictures.map((picture, index) => (
      <GalleryImage
          picture={picture}
          index={index}
          >
      </GalleryImage>
    ))
  
    const options={
      thumbnails:{
        showThumbnails:false
      },
      buttons: {
        showDownloadButton: false
      }
    }

    const callbacks = {
      onSlideChange: object => console.log(object),
      onLightboxOpened: object => setIsBlurred(true),
      onLightboxClosed: object => setIsBlurred(false),
      onCountSlides: object => console.log(object)
  };
  
    let galleryStyle;
    if (isBlurred){
      galleryStyle = {
        filter:"blur(5px)"
      }
    }

    return(
      <section id="gallery"> 
        <SRLWrapper 
          callbacks={callbacks}
          options={options}>
            <div id="gallery-pictures" style={galleryStyle}>{galleryDisplay}</div>
        </SRLWrapper>
      </section>
    )
  }

  function GalleryImage(props) {

    const [isVisible, setIsVisible] = useState(true)

    function onGalleryImgLoad() {
      setIsVisible(true)            
    }

    let cssClass = "gallery-img-item";
    
    if (isVisible === true) cssClass += "  is-visible";

    return(
        <div className={cssClass}>
          <div className="image-container">
            <img onLoad={onGalleryImgLoad} src={props.picture.filename}/>
          </div>
        </div>
    )
  }

  export default GallerySection;