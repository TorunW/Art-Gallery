import React, { useEffect, useState, Suspense, lazy } from 'react';
import './App.css';
import GallerySection from './gallery/Gallery';
import $ from 'jquery';
import SimpleReactLightbox from "simple-react-lightbox";
import { SRLWrapper } from "simple-react-lightbox";
import {breakArrayIntoChunksHelper} from './helpers';
import { Link, Route, Switch } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import Admin from './admin/Admin';

function App(props) {

  const [navigation, setNavigation] = useState([])

  useEffect(() => {
    getNavigation()
  },[])

  function getNavigation() {
    fetch('/navigation')
    .then(res => res.text())
    .then(res =>{
      console.log(JSON.parse(res));
      setNavigation(JSON.parse(res));
    })
  }

  let headerDisplay = <Header navigation={navigation}/>
  if (window.location.href.indexOf('/admin') !== -1) headerDisplay=''

  return (
    <div className="app">
      <SimpleReactLightbox>
        {headerDisplay}
        <SectionsContainer
          navigation={navigation} 
        />
      </SimpleReactLightbox>  
    </div>
  );
}

function Header(props) {

  const navItemsDisplay = props.navigation.map((menuItem, index) => {
    return (
      <li key={index}><Link to={menuItem.nav_link}>{menuItem.title}</Link></li>
    )
  })
  
  return (
    <header>
      <h1>Charlotte Karlbom</h1>
      <nav>
        <ul>
         {navItemsDisplay}
        </ul>
      </nav>
    </header>
  )
}

function SectionsContainer(props) {

  const sectionsDisplay = props.navigation.map((section,index) => {
      let sectionHtmlDisplay = (
        <section id={section.nav_link}>
          <h2>{section.title}</h2>
        </section>
      )
      
      switch (section.title) {
        case 'home':
          sectionHtmlDisplay = (
            <Route exact path="/"><GallerySection/></Route>
          )
          break;
        case 'paintings':
          sectionHtmlDisplay = (
            <Route exact path="/paintings"><PaintingsSection/></Route>
          )
          break;
        case 'sculptures':
          sectionHtmlDisplay = (
            <Route exact path="/sculptures"><SculpturesSection/></Route>
          )
          break;
        case 'contact':
          sectionHtmlDisplay = (
            <Route exact path="/contact"><ContactSection/></Route>
          )
          break;
        case 'about':
          sectionHtmlDisplay = (
            <Route exact path="/about"><AboutSection/></Route>
          )
          break;
        default:
        sectionHtmlDisplay = (
          <Route exact path="/"><GallerySection/></Route>
        )
          break;
      }

      return (
        <React.Fragment key={index}>
          {sectionHtmlDisplay}
        </React.Fragment>
      )
    }
  )

  const adminSectionDisplay = (
    <Route path="/admin">
        <Admin/>
    </Route>
  )
  return(
    <main>
     {sectionsDisplay}
     {adminSectionDisplay}
    </main>
  )
}

function PaintingsSection(props) {

  const [paintings, setPaintings] = useState([])

  useEffect(() => {
    getPaintings()
  },[])

  function getPaintings() {
    fetch('/pictures/paintings')
    .then(res => res.text())
    .then(res =>{
      const newPaintings = breakArrayIntoChunksHelper(2, JSON.parse(res))
      setPaintings(newPaintings);
    })
  }

  const galleryDisplay = paintings.map((subArray) => (
    <div className="container">
      {
        subArray.map((painting) => (
          <div className="box">
            <img src={painting.filename}/>
            <span>text</span>
          </div>
        ))
      }
    </div>
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
    <section id="paintings">
        <SRLWrapper 
         options={options}>
          <div id="gallery-pictures">{galleryDisplay}</div>
        </SRLWrapper>
    </section>
  )
}

function SculpturesSection(props) {

  const [sculptures, setSculptures] = useState([])

  useEffect(() => {
    getSculptures()
  },[])

  function getSculptures() {
    fetch('/pictures/sculpture')
    .then(res => res.text())
    .then(res =>{
      const newSculptures = breakArrayIntoChunksHelper(2, JSON.parse(res))
      setSculptures(newSculptures);
    })
  }
 
  const galleryDisplay = sculptures.map((subArray) => (
    <div className="container">
    {
      subArray.map((sculpture) => (
        <div className="box">
          <img src={sculpture.filename}/>
          <span>text</span>
        </div>
        ))
      }
    </div>
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
    <section id="sculptures">
        <SRLWrapper 
         options={options}>
          <div id="gallery-pictures">{galleryDisplay}</div>
        </SRLWrapper>
    </section>
  )
}

function AboutSection(props) {


  return (
   <section id="about">
     <div className="title"><h1>About me</h1></div>

     <div class="row">
       <div class="col-4">
        <div className="profile-img-container"><img src="img/pictures/profile.jpg"/></div>
       </div>
       <div class="col-8">
        <div className="description">
          <p>Jag var verksam som sjukgymnast under drygt 15 ar, men har nu lämnat varden för att kunna fokusera pa konsten.<br/> 
            Jag har alltid varit intresserad av konst och konsthantverk, 
            arbetade tidigare mest med lera men för dryga 10 ar sedan upptäckte jag 
            glädjen och fascinationen i att uttrycka mig genom maleriet.<br/> Jag är i huvudsak autodidakt, 
            har gatt diverse kvälls- och dagkurser. Jag malar figurativt i olja
            och arbetar även med collage i tidningspaper.</p>
          </div>
        </div>
      </div>
   </section>

  )
}

function ContactSection(props) {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)

  function onNameChange(e) {
    setName(e.target.value)
  }

  function onEmailChange(e) {
    setEmail(e.target.value)
  }

  function onMessageChange(e) {
    setMessage(e.target.value)
  }

  function onSubmit(e) {
    e.preventDefault();
    let newErrors = [];

    var letters
    if (name.length === 0) {
      const nameError = {
        msg: "Write something here", 
        type: "name"
      }
      newErrors.push(nameError)
    }
    else if (!name.match(letters)){
      const nameError = {
        msg: "Please, don't use symbols", 
        type: "name"
      }
      newErrors.push(nameError)
    }

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(email).toLowerCase())) {
        const emailError = {
          msg: "Please, use a valid email", 
          type: "email"
        }
        newErrors.push(emailError)
      }


    setErrors(newErrors)
    if (newErrors.length === 0) {
      postMessage();
    }
}

function postMessage() {
  console.log(
    "what"
  )

  $.ajax({
    url:'/messages',
    type:'POST',
    data: {name:name, email:email, msg:message }
  }).done(function(res) {
    setIsSubmitted(true)
  })
}

  let nameErrorDisplay, emailErrorDisplay;
  if (errors.length > 0) {
    errors.forEach(function(error, index){
     if (error.type === "name") nameErrorDisplay = <small>{error.msg}</small>
      else if (error.type === "email") emailErrorDisplay = <small>{error.msg}</small>
    })
  }

  let formDisplay = (
    <form>
    <div className="form-group">
      <label>Name</label>
      <input type="text" value={name} className="form-control" placeholder="Enter Name" onChange={(e) => onNameChange(e)}/>
      {nameErrorDisplay}
    </div>
    <div className="form-group">
      <label for="exampleInputEmail1">Email address</label>
      <input type="email" value={email} className="form-control" placeholder="Enter email" onChange={(e) => onEmailChange(e)}/>
      {emailErrorDisplay}
    </div>
    <div class="form-group">
      <label>Your message</label>
      <textarea className="form-control" rows="5" onChange={(e) => onMessageChange(e)}>{message}</textarea>
    </div>
    <button type="submit" onClick={(e) => onSubmit(e)} className="btn btn-primary">Submit</button>
  </form>
  )

  if (isSubmitted === true) formDisplay=<p>Form submitted!</p>

  return(
    <section id="contact">
      {formDisplay}
    </section>
  )
}

export default App;
