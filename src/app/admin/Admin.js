import React, {useState, useEffect} from 'react';
import './Admin.css';
import FileUploader from '../partials/file-uploader';
import $ from 'jquery';
import { Button, Header, Icon, Modal, Message } from 'semantic-ui-react';



function Admin(props) {

  const [dbTables, setDbTables] = useState(['pictures', 'messages']);
  const [currentSection, setCurrentSection] = useState('admin');


  const navItemsDisplay = dbTables.map((table, index) => {
    let menuItemclassName = 'item';
    if (currentSection === table) menuItemclassName += ' active';
    return (
      <a className={menuItemclassName} onClick={() => setCurrentSection(table)}>{table}</a>
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
    
  let mainMenuItemclassNameName = 'item';
  if (currentSection === "admin") mainMenuItemclassNameName += ' active';

  return(
    <section id="admin">
      <nav>
        <div className="ui secondary pointing menu">
          <a className={mainMenuItemclassNameName} onClick={() => setCurrentSection("admin")}>Admin main</a>
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
    const [loading, setLoading] = useState(true)
    const [selectedItem, setSelectedItem] = useState(null)

    useEffect(() => {
        getItems()
    },[])

    useEffect(() => {
      if (selectedItem !== null) setShowForm(true)
  },[selectedItem])


    function getItems()  {
        setLoading(true)
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
          window.scrollTo({top:0,behavior:'smooth'})
          setLoading(false)
        })
    }

    function deleteItem(item) {

      setLoading(true)
      $.ajax({
        url:'/delete',
        type:'POST',
        data:{path:item.filename}
      }).done(function(res){
        console.log(res)
        $.ajax({
          url:'http://localhost:80/pictures/' + item.picture_id,
          type:'DELETE'
        }).done(function(res) {
          console.log(res)
          getItems();
        })
      })
    }

    function onFinishFormSubmit() {
      setShowForm(false)
      getItems()
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
            if (column === 'filename') {
                cellDisplay =(
                  <img src={item[column]} width="50px" height="50px"/>
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
          <TableRowUserMenu
            item={item}
            deleteItem={deleteItem}
            setSelectedItem={setSelectedItem}
          />
        </td>
      </tr>
    ))

    let tableDisplay, formDisplay;
    if (showForm === false) {
      let addButtonDisplay;
      if (props.fetchUrl === '/pictures') {
        addButtonDisplay = (
          <a onClick={() => setShowForm(true)}className="ui green basic button">
            <i className="plus icon"></i>
            Lägg till bild
          </a>
        )
      }

      let loadingDisplay;
      if (loading === true) {
        loadingDisplay = (
          <div class="ui active inverted dimmer">
            <div class="ui text loader"><b>loading...</b></div>
          </div>
      )
      }

      tableDisplay = (
        <React.Fragment>
          {addButtonDisplay}
          <div className="dimmable">
            {loadingDisplay}
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
          </div>
        </React.Fragment>
      )
    } else {
      console.log("selected item on parent")
      console.log(selectedItem);
      formDisplay = (
        <AddItemForm
          columns={columns}
          selectedItem={selectedItem}
          onFinishFormSubmit={onFinishFormSubmit}
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

  const [open, setOpen] = React.useState(false)

  function onApprovedDeleteClick() {
    setOpen(false)

    props.deleteItem(props.item)
  }
  
  return(
    <div className="table-row-user-menu">
      <button className="ui icon blue button" onClick={()=> props.setSelectedItem(props.item)}>
        <i className="pencil alternate icon"></i>
      </button>
        <Modal
          basic
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          size='tiny'
          trigger={<Button icon color='red'><Icon name='trash' /></Button>}
        >
          <Header icon>
            <Icon name='trash alternate outline' />
              Ta bort bild
            </Header>
          <Modal.Content>
            <p>
              Vill du radera den här bilden?
            </p>
          </Modal.Content>
          <Modal.Actions>
            <Button basic color='red' inverted onClick={() => setOpen(false)}>
              <Icon name='remove' /> Nej
            </Button>
            <Button color='green' inverted onClick={() => onApprovedDeleteClick()}>
              <Icon name='checkmark' /> Ja
            </Button>
          </Modal.Actions>
        </Modal>
        </div>
  )
}

function AddItemForm(props) {

  let initFormData = props.selectedItem !== null ? props.selectedItem : {};
  const [formData, setFormData] = useState(initFormData)
  const [errors, setErrors] = useState([])
  console.log(errors)

  function onUpdateFormField(obj) {
    const newFormData = {
    ...formData, ...obj
    }
    setFormData(newFormData)
  }

  function updateFormErrors(obj) {
    let errorIndex = -1;
    errors.forEach(function(error, index){
      if (error.column === obj.column) {
        errorIndex = index
      }
    })
    const newErrors = [
    ...errors, obj
    ]
    setErrors(newErrors)
  }

  function onFormSubmit() {
    console.log(formData);
    let ajaxUrl = '/pictures';
    let ajaxType = 'POST';
    if (props.selectedItem !== null) {
      console.log("hello what why?");
      ajaxUrl += '/' + formData.picture_id;
      ajaxType = 'PUT'
    }

    $.ajax({
      url:ajaxUrl,
      type:ajaxType,
      data: formData
    }).done(function(res) {
      console.log(res)
      props.onFinishFormSubmit()
    })
  }

  const formFieldsDisplay = props.columns.map ((column, index) => {
    
    let showFormField = true;
    if (column === 'created_at' || column.indexOf('_id') > -1 ) showFormField = false;
    if (showFormField === true) {
      let defaultValue = null;
      if (props.selectedItem !== null) defaultValue = props.selectedItem[column]
      return(
        <FormField 
          key={index}
          column={column}
          defaultValue={defaultValue}
          onUpdateFormField={onUpdateFormField}
          updateFormErrors={updateFormErrors}
        />
      )
    }
   
  })


  return(
    <div className="add-item-form">
      <div className="ui form">
        {formFieldsDisplay}
        <button className="ui button" onClick={onFormSubmit}>
          {props.selectedItem !== null ? "Uppdatera bild" : "Lägg till Bild"}
        </button>
      </div>
    </div>
  )
}

function FormField(props) {
  
  let initData = props.defaultValue !== null ? props.defaultValue : '';
  const [ data, setData ] = useState(initData)
  const [error, setError] = useState({})

  useEffect (()=>{
    if (data !== initData) {
      const newError = validateField(data)
      setError(newError)
      if (!newError.msg) {
        let obj = {};
        obj[props.column] = data;
        props.onUpdateFormField(obj)
      }
    }
  },[data])

  useEffect(()=>{
    props.updateFormErrors(error)
  },[error])

  function updateInput(value) {
    setData(value)
  }

  function validateField(value) {
    let newError = {};
    if (props.column === 'caption') {
      if (value.length < 3) {
        newError.msg = 'this is an error'
        newError.column = props.column
      } else newError = {}
    }
    return newError;
  }
  let errorMessageDisplay;
  if (error.msg && error.column === props.column) {
    errorMessageDisplay = (
      <Message negative>
        <p>
          {error.msg}
        </p>
      </Message>
    )
  }
  let formFieldDisplay = (
    <React.Fragment>
      <label>Titel</label>
      <input value={data} onChange={e => updateInput(e.target.value)} placeholder={props.column} type="text"/>
      {errorMessageDisplay}
    </React.Fragment>
  )

  switch (props.column) {
    case 'filename': 
      if (props.defaultValue === null) {
        formFieldDisplay = (
          <div id="form-img-container">
            <FileUploader updateInput={updateInput}/>
          </div>
        )
      } else {
        formFieldDisplay = <div id="form-img-container"><img src={props.defaultValue}/></div>
      }
    break;  
    case 'picture_type':
      formFieldDisplay = (
        <React.Fragment>
          <label>Gallery</label>
          <select onChange={e => updateInput(e.target.value)}>
            <option value="">Gallery</option>
            <option selected={props.defaultValue === "paintings" ? "selected" : ""} value="paintings">Tavlor</option>
            <option selected={props.defaultValue === "sculptures" ? "selected" : ""} value="sculpture">Skulpturer</option>   
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
          <div className="ui right labeled input">
            <input value={data} onChange={e => updateInput(e.target.value)} type="text"/>
            <div className="ui basic label">
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
      {errorMessageDisplay}
    </div>
  )
}

export default Admin;