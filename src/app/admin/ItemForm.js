import React, {useState, useEffect, useRef} from 'react';
import FileUploader from '../partials/file-uploader';
import $ from 'jquery';
import { Message } from 'semantic-ui-react';
import TextEditor from './textEditor';
import { renderDisplayName } from '../helpers';

function ItemForm(props) {
    let initFormData = props.selectedItem !== null ? props.selectedItem : {};
    const [formData, setFormData] = useState(initFormData)
    const [errors, setErrors] = useState([])
    const [showChildError, setShowChildError] = useState(false)
    
    function onUpdateFormField(obj) {
      const newFormData = {
      ...formData, ...obj
      }
      setFormData(newFormData)
    }
  
    function updateFormErrors(obj) {
      let newErrors = errors;
      const errorIndex = errors.findIndex(error => error.column === obj.column)
      if (obj.msg) {
        //if there is an error
        if (errorIndex === -1) {
          newErrors.push(obj)
        }
      } else {
        //if there is no error
        newErrors = [
          ...errors.slice(0, errorIndex -1), 
          ...errors.slice(errorIndex +1, errors.length -1)
        ]
      }
      setErrors(newErrors)
    }
  
    function beforeFormSubmit() {
      if (errors.length === 0) {
        if (props.fetchUrl === '/pictures') {
          if (formData.filename && formData.picture_type && formData.price && formData.caption && formData.description) {
            setShowChildError(false)
            onFormSubmit()
          } else {
            setShowChildError(true)
          }
        } else {
          setShowChildError(false)
          onFormSubmit()
        }
      } else {
        setShowChildError(true)
      }
    }
  
    function onFormSubmit() {

      let ajaxUrl = props.fetchUrl;
      let ajaxType = 'POST';
      let action = 'create'
      if (props.selectedItem !== null) {
        if (props.fetchUrl === '/pictures') ajaxUrl += '/' + formData.picture_id;
        ajaxType = 'PUT'
        action = 'update'
      }

      $.ajax({
        url:ajaxUrl,
        type:ajaxType,
        data: formData
      }).done(function(res) {
        let item = {picture_id:0}
        if (props.fetchUrl === '/about') props.onFinishFormSubmit()
        else props.onFinishFormSubmit(action, item, 'success')
      })
    }
  
    const formFieldsDisplay = props.columns.map ((column, index) => {
      
      let showFormField = true;
      if (column.columnName === 'created_at' || column.columnName.indexOf('_id') > -1 ) showFormField = false;
      if (showFormField === true) {
        let defaultValue = null;
        if (props.selectedItem !== null) defaultValue = props.selectedItem[column.columnName]
        return(
          <FormField 
            key={index}
            column={column}
            defaultValue={defaultValue}
            onUpdateFormField={onUpdateFormField}
            updateFormErrors={updateFormErrors}
            showChildError={showChildError}
            formData={formData}
          />
        )
      }
     
    })
  
    let backButtonDisplay;
    if (props.fetchUrl === '/pictures') {
      backButtonDisplay = (
        <button onClick={props.onBackButtonClick} className="ui icon button">
          <i className="left chevron icon"></i>
        </button>
      )
    }
  
  
    return(
      <React.Fragment>
        <div className="form-header">
          {backButtonDisplay}
          <h1>{renderDisplayName(props.fetchUrl.split('/')[1])}</h1>
        </div>
          <div className={"add-item-form " + (showChildError === true ? "missing-file" : "")}>
            <div className="ui form">
              {formFieldsDisplay}
              <button className="ui button" onClick={beforeFormSubmit}>
                {props.selectedItem !== null ? "Uppdatera" : "Lägg till Bild"}
              </button>
            </div>
          </div>
      </React.Fragment>
    )
  }
  
  function FormField(props) {
    
    let initData = props.defaultValue !== null ? props.defaultValue : '';
    const [ data, setData ] = useState(initData)
    const [error, setError] = useState({column:props.column.columnName})
    const [imgMarginTop, setImgMarginTop] = useState(0)
    const editor = useRef(null)
	
	const config = {
		readonly: false // all options from https://xdsoft.net/jodit/doc/
	}
  
    useEffect (()=>{
      if (props.showChildError === true) {
        const newError = validateField(data)
        setError(newError)
      }
    },[props.showChildError])
  
    useEffect (()=>{
      if (data !== initData) {
        const newError = validateField(data)
        setError(newError)
        if (!newError.msg) {
          let obj = {};
          obj[props.column.columnName] = data;
          props.onUpdateFormField(obj)
        }
      }
    },[data])
  
    useEffect(()=>{
      props.updateFormErrors(error)
    },[error])

    function onImgLoad(e) {
      const parentDivHeight = document.getElementById('item-img').offsetHeight;
      const imgHeight = e.target.clientHeight
      const newImgMarginTop = (parentDivHeight - imgHeight) / 2;
      setImgMarginTop(newImgMarginTop)
  } 
  
    function updateInput(value) {
      setData(value)
    }
  
    function validateField(value) {
      let newError = {column:props.column.columnName};
      if (props.column.columnName === 'caption') {
        if (value.length < 3) {
          newError.msg = 'Titel  får inte vara tom'
        }
      } else if (props.column.columnName === 'description') {
        if (value.length < 3) {
          newError.msg = 'Beskrivning får inte vara tom'
        }
      } else if (props.column.columnName === 'price') {
        var numbers = /^[0-9]+$/;
        if(!value.match(numbers)) {
          newError.msg = 'Får inte innehålla bokstäver'
        }
      } else if (props.column.columnName === 'picture_type') {
          if (value === '0') {
            newError.msg = 'Välj kategori'
          }
      }
      return newError;
    }
  
    let errorMessageDisplay;
    if (error.msg && error.column === props.column.columnName) {
      errorMessageDisplay = (
        <Message negative>
          <p>
            {error.msg}
          </p>
        </Message>
      )
    }
    let formFieldDisplay;
  
    let fileUploaderDisplay = (
      <div id="form-img-container">
          <div className="inner-img-container">
            <FileUploader updateInput={updateInput} existingImg={props.formData.profile_img}/>
          </div>
        </div>
    )
  
    let textAreaDisplay = (
      <React.Fragment>
        <label>{props.column.columnName === 'description' ? 'Beskrivning' : 'Om mig'}</label>
        <textarea onChange={e => updateInput(e.target.value)} rows="2">
          {data}
        </textarea>
      </React.Fragment>
    )
  
    switch (props.column.columnName) {
      case 'filename': 
        if (props.defaultValue === null) {
          formFieldDisplay = (
            <div id="form-img-container">
              <div className="inner-img-container">
                <FileUploader updateInput={updateInput}/>
              </div>
            </div>
          )
        } else {
          formFieldDisplay = (
            <div id="form-img-container">
              <div className="inner-img-container" id="item-img" >
                <img src={props.defaultValue} style={{marginTop:imgMarginTop + 'px'}} onLoad={(e)=> onImgLoad(e)}/>
              </div>
            </div>
          )
        }
      break;
      case 'profile_img' :
        formFieldDisplay = fileUploaderDisplay;
      break;
      case 'picture_type':
        formFieldDisplay = (
          <React.Fragment>
            <label>Gallery</label>
            <select onChange={e => updateInput(e.target.value)}>
              <option value="0">Gallery</option>
              <option selected={props.defaultValue === "paintings" ? "selected" : ""} value="paintings">Maleri</option>
              <option selected={props.defaultValue === "sculptures" ? "selected" : ""} value="sculpture">Mosaik</option>   
            </select>
          </React.Fragment>
        )
      break;
      case 'description':
        formFieldDisplay = textAreaDisplay
      break;
      case 'about_text':
        formFieldDisplay = (
            <TextEditor
              updateInput={updateInput}
              defaultValue={props.defaultValue}
            />
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
          <input value={data} onChange={e => updateInput(e.target.value)} placeholder={props.column.columnName} type="text"/>
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
  
  export default ItemForm;