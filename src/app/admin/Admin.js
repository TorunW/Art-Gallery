import React, {useState, useEffect} from 'react';
import { Link, Route, Switch } from "react-router-dom";
import './Admin.css';
import FileUploader from '../partials/file-uploader';
import $ from 'jquery';


function Admin(props) {

  const [dbTables, setDbTables] = useState(['pictures', 'messages']);
  const [currentSection, setCurrentSection] = useState('admin');


  const navItemsDisplay = dbTables.map((table, index) => {
    let menuItemClassName = 'item';
    if (currentSection === table) menuItemClassName += ' active';
    return (
      <a className={menuItemClassName} onClick={() => setCurrentSection(table)}>{table}</a>
    )
  })

  let contentDisplay = <div>Hello im admin homepage</div>
  if (currentSection !== "admin"){
    contentDisplay = dbTables.map((table, index) => {
      if (currentSection === table) {
        return(
          <DBTableRender key={index} fetchUrl={"/" + table}/>
        )
      }
    })
  }
    
  let mainMenuItemClassName = 'item';
  if (currentSection === "admin") mainMenuItemClassName += ' active';

  return(
    <section id="admin">
      <nav>
        <div className="ui secondary pointing menu">
          <a className={mainMenuItemClassName} onClick={() => setCurrentSection("admin")}>Admin main</a>
          {navItemsDisplay}
        </div>
      </nav>
      {contentDisplay}
    </section>
  )
}

function DBTableRender(props) {

    const [items, setItems] = useState([])
    const [columns, setColumns] = useState([])
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        getItems()
    },[])

    function getItems()  {
        fetch(props.fetchUrl)
        .then(res => res.text())
        .then(res =>{
          const newItems = JSON.parse(res);
          let columnArray = []
          for (var i in newItems[0]){
            columnArray.push(i)
          }
            setColumns(columnArray)
           setItems(JSON.parse(res));
        })
    }

    const columnsDisplay = columns.map((column, index) => (
        <th key={index} scope="col">
            {column}
        </th>
    ))

    const itemsDisplay = items.map((item, index) => (
      <tr key={index}>
        {
          columns.map((column, index) => {

            let cellDisplay = item[column];
            if (column === 'update') {
                cellDisplay =(
                    <span>hello cbcdkjsjkn</span>
                )
            }
            return(
                <td key={index}>
                  {cellDisplay}
                </td>
              )
          })
        }
        <td>
          <TableRowUserMenu/>
        </td>
      </tr>
    ))

    let tableDisplay, formDisplay;
    if (showForm === false) {
      tableDisplay = (
        <React.Fragment>
          <a onClick={() => setShowForm(true)}className="ui green basic button">
            <i className="plus icon"></i>
            Add
          </a>
            <table className="ui celled table">
            <thead>
                <tr>
                {columnsDisplay}
                <th>update</th>
                </tr>
            </thead>
            <tbody>
            {itemsDisplay}
            </tbody>
            </table>
        </React.Fragment>
      )
    } else {
      formDisplay = (
        <AddItemForm
          columns={columns}
        />
      )
    }

    return(
      <div className="admin-table-container">
        {tableDisplay}
        {formDisplay}
      </div>
    )
}

function TableRowUserMenu(props) {
  
  return(
    <div className="table-row-user-menu">
      <button className="ui icon blue button">
        <i className="pencil alternate icon"></i>
      </button>
      <button className="ui icon red button">
        <i className="trash icon"></i>
      </button>
    </div>
  )
}

function AddItemForm(props) {

  const [formData, setFormData] = useState({})

  function onUpdateFormField(obj) {
    const newFormData = {
    ...formData, ...obj
    }
    setFormData(newFormData)
  }

  function onFormSubmit() {
    console.log(formData);
    $.ajax({
      url:'/pictures',
      type:'POST',
      data: formData
    }).done(function(res) {
      console.log(res)
    })
  }

  const formFieldsDisplay = props.columns.map ((column, index) => {
    
    let showFormField = true;
    if (column === 'created_at' || column.indexOf('_id') > -1 ) showFormField = false;
    if (showFormField === true) {
      return(
        <FormField 
          key={index}
          column={column}
          onUpdateFormField={onUpdateFormField}
        />
      )
    }
   
  })

  return(
    <div className="add-item-form">
      <div className="ui form">
        {formFieldsDisplay}
        <button className="ui button" onClick={onFormSubmit}>Lägg till bild</button>
      </div>
    </div>
  )
}

function FormField(props) {

  const [ data, setData ] = useState("")

  useEffect (()=>{
    let obj = {};
    obj[props.column] = data;
    props.onUpdateFormField(obj)
  },[data])

  function updateInput(value) {
    setData(value)
  }

  let formFieldDisplay = (
    <React.Fragment>
      <label>Titel</label>
      <input value={data} onChange={e => updateInput(e.target.value)} placeholder={props.column} type="text"/>
    </React.Fragment>
  )

  switch (props.column) {
    case 'filename': 
      formFieldDisplay = (
        <FileUploader updateInput={updateInput}/>
      )
    break;  
    case 'picture_type':
      formFieldDisplay = (
        <React.Fragment>
          <label>Gallery</label>
          <select onChange={e => updateInput(e.target.value)}>
            <option value="">Gallery</option>
            <option value="paintings">Tavlor</option>
            <option value="sculpture">Skulpturer</option>   
          </select>
        </React.Fragment>
      )
    break;
    case 'description':
      formFieldDisplay = (
        <React.Fragment>
          <label>Beskrivning</label>
          <textarea onChange={e => updateInput(e.target.value)} rows="2">
            {data}
          </textarea>
        </React.Fragment>
      )
      break;
    case 'price':
      formFieldDisplay = (
        <React.Fragment>
          <label>Pris</label>
          <div class="ui right labeled input">
            <input value={data} onChange={e => updateInput(e.target.value)} type="number"/>
            <div class="ui basic label">
              kr
            </div>
          </div>
        </React.Fragment>
      )
    break;
    default:
    formFieldDisplay = (
      <React.Fragment>
        <label>Titel</label>
        <input value={data} onChange={e => updateInput(e.target.value)} placeholder={props.column} type="text"/>
      </React.Fragment>
    )
    break;
  }

  return(
    <div className="field">
      {formFieldDisplay}
    </div>
  )
}

export default Admin;