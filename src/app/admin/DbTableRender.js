import React, { useState, useEffect } from 'react';
import { SRLWrapper } from 'simple-react-lightbox';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import ItemForm from './ItemForm';
import $ from 'jquery';
import { renderDisplayName, renderTableColumnsArray } from '../helpers';

function DBTableRender(props) {

    const [items, setItems] = useState([])
    const [columns, setColumns] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [selectedItem, setSelectedItem] = useState(null)
    const [sortBy, setSortBy] = useState('created_at')
    const [messages, setMessages] = useState([])
    console.log(messages)

    useEffect(() => {
        getItems()
    },[])

    useEffect(() => {
      if (selectedItem !== null) setShowForm(true)
  },[selectedItem])

  function onBackButtonClick(){
    setShowForm(false);
    getItems();
  }

  function removeMessage(index) {
    let newMessages = [

    ]
    messages.forEach(function(msg, i){
      if (i !== index) newMessages.push(msg)
    })
    setMessages(newMessages)
  }

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
          columnArray = renderTableColumnsArray(columnArray, props.fetchUrl)
          setColumns(columnArray)
          if (props.fetchUrl !== '/about') setItems(JSON.parse(res))
          else {
            setSelectedItem(JSON.parse(res)[0]);
            setShowForm(true);
          }

          window.scrollTo({top:0,behavior:'smooth'})
          setLoading(false)
        })
    }

    function beforeDeleteItem(item) {
      console.log("before delete item");
        if (props.fetchUrl === '/messages') deleteItem(item)
        else deleteFile(item)
    }

    function deleteFile(item) {
      console.log("delete file");
      setLoading(true)
      $.ajax({
        url:'/delete',
        type:'POST',
        data:{path:item.filename}
      }).done(function(res){
        deleteItem(item)
      })
    }

    function deleteItem(item) {
      console.log("delete")
        $.ajax({
            url:'http://localhost:80'+ props.fetchUrl + '/' + (item.picture_id ? item.picture_id : item.msg_id),
            type:'DELETE'
          }).done(function(res) {
            beforeGetItems('delete', item, 'success')
          })
    }

    function onReadButtonClick(item) {
        $.ajax({
            url:'http://localhost:80'+ props.fetchUrl + '/' + (item.picture_id ? item.picture_id : item.msg_id),
            type:'PUT', 
            data: {read:(item.read === true ? false : true)}
          }).done(function(res) {
            getItems();
          })
    }

    function onFinishFormSubmit(action, item, type) {
      setShowForm(false)
      if (action) beforeGetItems(action, item, type)
      else getItems()
    }
 
    function beforeGetItems(action, item, type) {
      console.log(action, item, type)
      const itemType = item.picture_id > -1 ? 'Bilden' : 'Meddelande';
      let title = itemType + ' '
      if (itemType === 'Bilden') {
        if (action === 'create') title += 'är tillagd'
        else if (action === 'update') title += 'är uppdaterad'
        else title += 'är borttagen'
      } 
      else title += 'är borttaget'
      
      const msg = {type:type, title:title}
      const newMessages =[...messages, msg]
      setMessages(newMessages)
      getItems();
    }

    const excludedColumnsList = ['picture_id', 'msg_id', 'read']

    const columnsDisplay = columns.map((column, index) => {
      if (column.menuOnly === false) {
        return(
          <th key={index} scope="col">
              {column.displayName}
          </th>
      )
      }
    })

    function sortItems(a, b) {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0
    }

    const itemsDisplay = items.sort(sortItems).map((item, index) => (
      <tr className={item.read === true ? 'read' : ''} key={index}>
        {columns.map((column, index) => {
          if (column.menuOnly === false) {
            let cellDisplay = item[column.columnName];
            if (column.columnName === 'filename') {
                cellDisplay =(
                  <div className="img-thumbnail">
                    <img src={item[column.columnName]}/>
                  </div>
                )
            } else if (column.columnName === 'created_at') {
              let today = new Date(item[column.columnName]);
              cellDisplay = today.getDate() + "."+ parseInt(today.getMonth()+1) +"."+today.getFullYear();
            }
            return(
                <td key={index}>
                  {cellDisplay}
                </td>
              )
          }
        })}
        <td>
          <TableRowUserMenu
            item={item}
            deleteItem={beforeDeleteItem}
            setSelectedItem={setSelectedItem}
            fetchUrl={props.fetchUrl}
            onReadButtonClick={onReadButtonClick}
          />
        </td>
      </tr>
    ))

    let tableDisplay, formDisplay;
    if (showForm === false) {
      console.log(items)
      if (items.length === 0) {
        tableDisplay = 'Inga meddelanden'
      } else {
        let addButtonDisplay;
        if (props.fetchUrl === '/pictures') {
          addButtonDisplay = (
            <a onClick={() => setShowForm(true)}className="ui green basic button add-img-button">
              <i className="plus icon"></i>
              Lägg till bild
            </a>
          )
        }
  
        let loadingDisplay;
        if (loading === true) {
          loadingDisplay = (
            <div className="ui active inverted dimmer">
              <div className="ui text loader"><b>loading...</b></div>
            </div>
        )
        }
  
        tableDisplay = (
          <React.Fragment>
            <div className="table-header">
              <h1>{renderDisplayName(props.fetchUrl.split('/')[1])}</h1>
              <div className="ui text menu">
                <div className="header item">Sortera</div>
                {columns.map((column, index) => (
                  <a key={index} onClick={() => setSortBy(column.columnName)} className={'item ' + (sortBy === column.columnName ? 'active' : '')}>
                    {column.displayName}
                  </a>
                ))}
              </div>
              {addButtonDisplay}
            </div>
            <div className={"dimmable " + props.fetchUrl.split('/')[1]}>
              {loadingDisplay}
              <table className="ui celled table">
              <thead>
                  <tr>
                  {columnsDisplay}
                  <th>{props.fetchUrl === '/pictures' ? 'Redigera/ Ta bort bild' : 'Radera meddelande'}</th>
                  </tr>
              </thead>
              <tbody>
              {itemsDisplay}
              </tbody>
              </table>
            </div>
          </React.Fragment>
        )
      }
    } else {
      formDisplay = (
        <ItemForm
          columns={columns}
          selectedItem={selectedItem}
          onFinishFormSubmit={onFinishFormSubmit}
          onBackButtonClick={onBackButtonClick}
          fetchUrl={props.fetchUrl}
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

    return(
      <div className="admin-table-container">
        <AdminMessagesContainer messages={messages} removeMessage={removeMessage}/>
        <SRLWrapper options={options}>
          {tableDisplay}
        </SRLWrapper>
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
  
    let readButtonDisplay;

    let editButtonDisplay;
    if (props.fetchUrl === '/pictures') {
      editButtonDisplay = (
      <button className="ui icon blue button" onClick={()=> props.setSelectedItem(props.item)}>
        <i className="pencil alternate icon"></i>
      </button>) 
    } else {
        readButtonDisplay = (
            <button className="ui icon button" onClick={()=> props.onReadButtonClick(props.item)}>
              <i className={'envelope ' + (props.item.read === true ? 'open' : '') + '  outline icon'}></i>
            </button>)
    }
    
    return(
      <div className="table-row-user-menu">
          {readButtonDisplay}
          {editButtonDisplay}
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

function AdminMessagesContainer(props) {

  const messagesDisplay = props.messages.map((message, index) => (
    <AdminMsg key={index} message={message} removeMessage={()=> props.removeMessage(index)}/>
  ))

  return(
    <div id="messages-container">
      {messagesDisplay}
    </div>
  )
}

function AdminMsg(props) {
  const [fadeout, setFadeout] =useState(false)
  
  const message = props.message
  
  useEffect(()=> {
    setTimeout(() => {
      setFadeout(true)
      setTimeout(() => {
        props.removeMessage()
      }, 2000);
    }, 3000);
  },[])

  return(
    <div className={"ui "+ message.type + " message " + (fadeout === true ? 'fadeout' : '')}>
      <i className="close icon" onClick={e => props.removeMessage()}></i>
      <div className="header">
        {message.title}
      </div>
      <p>{message.msg}</p>
    </div>
  )
}

export default DBTableRender;