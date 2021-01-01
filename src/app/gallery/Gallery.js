import React, { useEffect, useState } from 'react';
import './Gallery.css';
import { SRLWrapper } from "simple-react-lightbox";


function GallerySection(props) {

  const [pictures, setPictures] = useState([])

    const [ showSlider, setShowSlider ] = useState(false)
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
  
    function onGalleryImgClick(img, index){
      setShowSlider(true)
      setCurrentImgIndex(index)
    }
  
    const galleryDisplay = pictures.map((picture, index) => (
      <GalleryImage
          picture={picture}
          index={index}
          onGalleryImgClick={onGalleryImgClick}
          >
      </GalleryImage>
    ))
  
    function onOverlayClick() {
      setShowSlider(false)
    }
      
    let overlayDisplay;
    if(showSlider === true){
      overlayDisplay = (
        <SlideShow
          onOverlayClick={onOverlayClick}
          pictures={pictures}
          currentImgIndex={currentImgIndex}
          setCurrentImgIndex={setCurrentImgIndex}
        />
      )
    }

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

    const [isVisible, setIsVisible] = useState(false)

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
  
  function SlideShow(props) {

    const [nextIndex, setNextIndex] = useState(null)

    function onNavButtonClick(value) {
      let indexValue = value;
      if(value < 0) indexValue = props.pictures.length -1;
      else if(value === props.pictures.length) indexValue = 0; 
      setNextIndex(indexValue)
      props.setCurrentImgIndex(indexValue)
    }
  
    return(
      <div id="overlay">
        <div id="overlay-black" onClick={props.onOverlayClick}></div>
         <div id="slideshow">
           <div className="nav-button left" onClick={() => onNavButtonClick(props.currentImgIndex -1)}></div>
            <img src={props.pictures[props.currentImgIndex].filename}/>
            <div className="nav-button right" onClick={() => onNavButtonClick(props.currentImgIndex +1)}></div>
         </div>
      </div>
    )
  }



  export default GallerySection;