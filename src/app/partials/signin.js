import React, {useState, useEffect} from 'react';
import $ from 'jquery';

function UserSignin(props) {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  function onSignin() {

    $.ajax({
      url:'/signin',
      type:'POST',
      data: {email:email, password:password }
    }).done(function(res) {
    })
  } 

  return(
  <section>
  <div className="page-login">
    <div className="ui centered grid container">
      <div className="nine wide column">
        <div className="ui icon warning message">
          <i className="lock icon"></i>
          <div className="content">
            <div className="header">
              Login failed!
            </div>
              <p>You might have misspelled your username or password!</p>
          </div>
        </div>
        <div className="ui fluid card">
          <div className="content">
            <form className="ui form" method="POST">
              <div className="field">
                <label>Email</label>
                <input type="text" name="user" placeholder="User" value={email} onChange={e => setEmail(e.target.value)}/>
              </div>
              <div className="field">
                <label>Password</label>
                <input type="password" name="pass" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
              </div>
              <button className="ui primary labeled icon button" type="submit" onClick={onSignin}>
                <i className="unlock alternate icon"></i>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  </section>
  )
  }

  export default UserSignin