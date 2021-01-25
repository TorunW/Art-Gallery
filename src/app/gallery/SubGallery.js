import React, { useEffect, useState, Suspense, lazy } from 'react';
import { SRLWrapper } from "simple-react-lightbox";
import { breakArrayIntoChunksHelper } from '../helpers';
import './SubGallery.css';
import { isMobile } from "react-device-detect";

function SubGallery(props) {
 
    const [pictures, setPictures] = useState([])
    const [chunksArray, setChunksArray ] = useState([])
    const [windowSize, setWindowSize] = useState(window.innerWidth > 577 ? 'normal' :  'small')
    const [ isBlurred, setIsBlurred ] = useState(false); 
  
    useEffect(() => {
      getPictures()
      window.addEventListener('resize', onWindowResize)
    },[])

    useEffect(() => {
      handelPictures(pictures)
    },[windowSize])

    function onWindowResize() {
      let currentWindowSize = window.innerWidth > 577 ? 'normal' :  'small';
      if (currentWindowSize !== windowSize) {
        setWindowSize(currentWindowSize)
      }
    }
  
    function getPictures() {
      fetch('/pictures/' + props.pictureType)
      .then(res => res.text())
      .then(res =>{
        handelPictures(JSON.parse(res))
        setPictures(JSON.parse(res))
      })
    }

    function handelPictures(pics) {
      let numChunks = 2;
      if (window.innerWidth < 577) numChunks = 1;
      const newPictures = breakArrayIntoChunksHelper(numChunks,pics)
      setChunksArray(newPictures);
    }
  
    const galleryDisplay = chunksArray.map((subArray, subIndex) => (
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
        <div className="sub-gallery">
          <SRLWrapper 
            callbacks={callbacks}
            options={options}>
              <div id="gallery-pictures" style={galleryStyle}>{galleryDisplay}</div>
          </SRLWrapper>
        </div>
    )
  }

  function SubGalleryRow(props) {
    
    const [hovered, setHovered] = useState(null)

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
    let initContainerWidth = (window.innerWidth*0.45) -30.81
    if (window.innerWidth < 577) initContainerWidth = (window.innerWidth*0.9) -30.81
    const [containerWidth, setContainerWidth] = useState(initContainerWidth)
    const [loadedImgWidth,setLoadedImgWidth] = useState(null)
    const [loadedImgHeight, setLoadedImgHeight] = useState(null)
    const [imgWidth, setImgWidth] = useState(null)
    const [imgHeight, setImgHeight] = useState(null)
    const [imgTop, setImgTop] = useState(null)
    const [imgLeft, setImgLeft] = useState(null)
    const [isHovered, setIsHovered] = useState(false)
    const [differential, setDifferential] = useState(null)
    const [isResized, setIsResized] = useState(false)
    const [inFrame, setInFrame] = useState(false)

    let resizeTimeout;

    useEffect(() => {
      window.addEventListener('resize', onWindowResize);
      if (isMobile === true) window.addEventListener('scroll', onMobileScroll);
    },[])

    useEffect(() => {
      setIsHovered(inFrame)
    },[inFrame])

    useEffect(() => {
      updateImgDimensions();
    },[containerWidth])

    useEffect(() => {
      if (loadedImgHeight !== null && loadedImgWidth !== null) updateImgDimensions();
    },[loadedImgHeight, loadedImgWidth])


    function onMobileScroll() {
      const el = document.getElementById('picture-' + picture.picture_id)
      var viewportOffset =
      el.getBoundingClientRect();
      //these are relative to the viewport, i.e the window
      var top = viewportOffset.top;
      var left = viewportOffset.left;
      const elHeight = el.offsetHeight
      const newInFrame = (top + elHeight) < window.innerHeight && top > 0
      setInFrame(newInFrame)
    }
  
    function onWindowResize(){
      setIsResized(true)
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resizedw, 500);
      let initContainerWidth = (window.innerWidth*0.45) -30.81
      if (window.innerWidth < 577) initContainerWidth = (window.innerWidth*0.9) -30.81
      setContainerWidth(initContainerWidth)
    }

    function resizedw(){
      setIsResized(false)
    }

    function onImgLoad(e) {
      setLoadedImgHeight(e.target.naturalHeight)
      setLoadedImgWidth(e.target.naturalWidth)
    }

    function updateImgDimensions() {
      
      let diff, adjImgTop, adjImgLeft;
      if (loadedImgWidth > loadedImgHeight) {
        diff = loadedImgHeight / containerWidth
        adjImgLeft = ((loadedImgWidth /diff) - containerWidth) / 2
      }
      else {
        diff = loadedImgWidth / containerWidth
        adjImgTop = ((loadedImgHeight /diff) - containerWidth) / 2
      }

      setImgHeight(loadedImgHeight / diff)
      setImgWidth(loadedImgWidth /diff) 
      setImgLeft(adjImgLeft)
      setImgTop(adjImgTop)
      setDifferential(diff)
    }

    let imgStyle = {}, imgClassName = '';
    if (imgHeight !== null) {
      let currentWidth = imgWidth, currentHeight = imgHeight, currentTop = imgTop, currentLeft = imgLeft;
      if (isHovered === true) {
        currentWidth = loadedImgWidth /(differential * 0.9);
        currentHeight = loadedImgHeight /(differential * 0.9);
        if (currentWidth > currentHeight) currentLeft = ((loadedImgWidth /(differential * 0.9)) - containerWidth) / 2;
        else currentTop = ((loadedImgHeight /(differential * 0.9)) - containerWidth) / 2;
      }
      imgStyle = {
        width:currentWidth,
        height:currentHeight,
        left:'-' + currentLeft + 'px',
        top:'-' + currentTop + 'px'
      }
      imgClassName = isResized === false ? 'loaded' : ''
    }


    return(
        <div className="box" id={"picture-" + picture.picture_id}>
          <div className="inner-box" onMouseEnter={()=> setIsHovered(true)} onMouseLeave={()=> setIsHovered(false)}>
            <img style={imgStyle} className={imgClassName} src={picture.filename} onLoad={e => onImgLoad(e)}/>
            <div className="info-container">
                <div className="left-container">
                    <h2>
                        {picture.caption}
                    </h2>
                    <p>
                        {picture.description}
                    </p>
                </div>
                <div className="right-container">
                <span>
                    {picture.price.split("kr")[0]}
                    <span style={{marginLeft:"3px"}}>kr</span>
                </span>
                </div>
            </div>  
          </div>
        </div>
    )
  }

  export default SubGallery;