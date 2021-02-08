import React, {useState, useEffect} from 'react';
import './Admin.css';
import DBTableRender from './DbTableRender';
import $ from 'jquery';
import { Icon, Label, Menu } from 'semantic-ui-react';
import {renderDisplayName} from '../helpers';

function Admin(props) {

  const [dbTables, setDbTables] = useState(['pictures', 'messages', 'about']);
  const [currentSection, setCurrentSection] = useState('admin');
  const [msgCounter, setMsgCounter] = useState(0)

  useEffect(()=> {
    countMsg()
  },[])

  function countMsg() {
    $.ajax({
      url:'/countreadmsg',
      type:'GET'
    }).done(function(res) {
      setMsgCounter(res[0]['COUNT(*)']);
    })
  }

  const navItemsDisplay = dbTables.map((table, index) => {
    let menuItemclassName = 'item';
    if (currentSection === table) menuItemclassName += ' active';
    let msgCounterDisplay;
    if (table === 'messages' && msgCounter !== 0) {
      msgCounterDisplay = (
        <Label color='red' floating>
          {msgCounter}
        </Label>
      )
    }
    return (
      <Menu.Item as="a" className={menuItemclassName} onClick={() => setCurrentSection(table)}>
        <Icon name={table === 'pictures' ? 'picture' : table === 'messages' ? 'mail' : 'user'}/>
        {renderDisplayName(table)}
        {msgCounterDisplay}
      </Menu.Item>
    )
  })

  let contentDisplay = <p>hello im admin</p>
  if (currentSection !== "admin"){
    contentDisplay = dbTables.map((table, index) => {
      if (currentSection === table) {
        return(
          <DBTableRender key={index} fetchUrl={"/" + table}/>
        )
      }
    })
  }
    
  let mainMenuItemclassNameName = 'item';
  if (currentSection === "admin") mainMenuItemclassNameName += ' active';

  return(
    <section id="admin">
      <div>
        <Menu compact>
            <Menu.Item as='a' className={mainMenuItemclassNameName} onClick={() => setCurrentSection("admin")}>
              Admin main
            </Menu.Item>
            {navItemsDisplay}
        </Menu>
      </div>
      {contentDisplay}
    </section>
  )
}

export default Admin;



/* if (obj.column) {
  let errorIndex = -1;
  errors.forEach(function(error, index){
    if (error.column === obj.column) {
      errorIndex = index
    }
  })
  let newErrors;
    if (errorIndex > -1) {
      const newErrors = [
        ...errors.slice(0, errorIndex -1), obj,
        ...errors.slice(errorIndex +1, errors.length -1)
        ]
    } else {
      newErrors = [
        ...errors, obj
      ]
    }
  setErrors(newErrors)
} */