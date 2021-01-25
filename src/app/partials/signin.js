function UserLogin(props) {
    console.log('suuuup')
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
                  <label>User</label>
                  <input type="text" name="user" placeholder="User"/>
                </div>
                <div className="field">
                  <label>Password</label>
                  <input type="password" name="pass" placeholder="Password"/>
                </div>
                <button className="ui primary labeled icon button" type="submit">
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

  export default UserLogin