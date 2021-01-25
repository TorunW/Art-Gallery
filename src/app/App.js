import React, { useEffect, useState, Suspense, lazy } from 'react';
import './App.css';
import GallerySection from './gallery/Gallery';
import $ from 'jquery';
import SimpleReactLightbox from "simple-react-lightbox";
import { Link, Route } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css';
import Admin from './admin/Admin';
import SubGallery from './gallery/SubGallery';
import UserLogin from './partials/signin';

function App(props) {

  const [navigation, setNavigation] = useState([])

  useEffect(() => {
    getNavigation()
  },[])

  function getNavigation() {
    fetch('/navigation')
    .then(res => res.text())
    .then(res =>{
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

  const [ showdropMenu, setShowDropMenu ] = useState(false)

  const navItemsDisplay = props.navigation.map((menuItem, index) => {
    if (menuItem.title !== 'home') {
      return (
        <li key={index}><Link onClick={()=> setShowDropMenu(false)} to={menuItem.nav_link}>{menuItem.display_name}</Link></li>
      )
    }
  })

  let menuDisplay = (
    <nav>
      <ul>
        {navItemsDisplay}
      </ul>
    </nav>
  );
  if (window.innerWidth < 577) {
    menuDisplay = <i className={(showdropMenu === true ? 'close' : 'bars') +  " icon"} onClick={()=> setShowDropMenu(showdropMenu === true ? false : true)}></i>
  } 

  let dropMenuDisplay;
  if (showdropMenu === true) {
    dropMenuDisplay = (
      <div className="drop-menu-container">
        <ul>
          {navItemsDisplay}
        </ul>
      </div>
    )
  }
  return (
    <header>
      <h1>
        <a id="main" href="/">Charlotte Karlbom</a>
      </h1>
        {menuDisplay}
        {dropMenuDisplay}
    </header>
  )
}

function SectionsContainer(props) {

  const sectionsDisplay = props.navigation.map((section,index) => {
      let sectionHtmlDisplay = (
        <section key={index} id={section.nav_link}>
          <h2>{section.title}</h2>
        </section>
      )
      
      switch (section.title) {
        case 'signin':
          sectionHtmlDisplay = null;
          break;
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
      <Route exact path="/signin">
        <UserLogin/>
      </Route>
    </main>
  )
}

function PaintingsSection(props) {

  return(
    <section id='paintings'>
      <SubGallery pictureType={'paintings'}/>
    </section>
  )
}

function SculpturesSection(props) {

  return(
    <section id='sculptures'>
      <SubGallery pictureType={'sculpture'}/>
    </section>
  )
}

function AboutSection(props) {

  const [aboutData, setAboutData] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAbout()
  },[])

  function getAbout() {
    fetch('/about')
    .then(res => res.text())
    .then(res =>{
      setAboutData(JSON.parse(res)[0]);
      setLoading(false)
    })
  }

  let imgDisplay = (
  <div class="ui placeholder">
    <div class="image"></div>
  </div>
  )

  let textDisplay = (
    <div class="ui placeholder">
      <div class="paragraph">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <div class="paragraph">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>
  )
  if (loading === false) {
    imgDisplay = <img src={aboutData.profile_img}/>
    textDisplay = <div dangerouslySetInnerHTML={{__html:aboutData.about_text}}></div>
  }

  return (
   <section id="about">
     <div className="title">
       <h1>Om mig</h1>
      </div>
     <div className="row">
        <div className="col-4">
          <div className="profile-img-container">
            {imgDisplay}
          </div>
        </div>
        <div className="col-8">
          <div className="description">
            {textDisplay}
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


  $.ajax({
    url:'/messages',
    type:'POST',
    data: {name:name, email:email, msg:message }
  }).done(function(res) {
    setIsSubmitted(true)
    setTimeout(() => {
      window.location.href = '/'
    }, 3000);
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
    <div id="contact-container">
      <form className="ui form">
        <div className="field">
          <label>Namn</label>
          <input type="text" value={name} className="form-control" placeholder="Namn" onChange={(e) => onNameChange(e)}/>
          {nameErrorDisplay}
        </div>
        <div className="field">
          <label>Emailadress</label>
          <input type="email" value={email} className="form-control" placeholder="Email" onChange={(e) => onEmailChange(e)}/>
          {emailErrorDisplay}
        </div>
        <div className="field">
          <label>Ditt meddelande</label>
          <textarea className="form-control" rows="5" onChange={(e) => onMessageChange(e)}>{message}</textarea>
        </div>
        <button type="submit" onClick={(e) => onSubmit(e)} className="ui submit button">Skicka meddelande</button>
      </form>
    </div>
  )

  if (isSubmitted === true) formDisplay=<p>Tack för ditt meddelande!</p>

  return(
    <section id="contact">
      {formDisplay}
    </section>
  )
}

export default App;
