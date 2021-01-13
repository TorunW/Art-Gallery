import React, {useState, useEffect} from 'react';
import { SRLWrapper } from 'simple-react-lightbox';
import { Button, Header, Icon, Modal } from 'semantic-ui-react';
import ItemForm from './ItemForm';
import $ from 'jquery';


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
        if (props.fetchUrl === '/messages') deleteItem(item)
        else deleteFile(item)
    }

    function deleteFile(item) {

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
        $.ajax({
            url:'http://localhost:80'+ props.fetchUrl + '/' + (item.picture_id ? item.picture_id : item.msg_id),
            type:'DELETE'
          }).done(function(res) {
            getItems();
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

    function onFinishFormSubmit() {
      setShowForm(false)
      getItems()
    }
 
    const excludedColumnsList = ['picture_id', 'msg_id', 'read']

    const columnsDisplay = columns.map((column, index) => {
      if (excludedColumnsList.indexOf(column) === -1){
        let columnNameDisplay = column;
        if (column === 'filename') columnNameDisplay = 'Bild';
        else if (column === 'picture_type') columnNameDisplay = 'Kategori';
        else if (column === 'price') columnNameDisplay = 'Pris';
        else if (column === 'caption') columnNameDisplay = 'Titel';
        else if (column === 'description') columnNameDisplay = 'Beskrivning';
        else if (column === 'created_at') {
          if (props.fetchUrl === '/pictures') columnNameDisplay = 'Bild upplagd'
          else columnNameDisplay = 'Datum'
        }

      return(
          <th key={index} scope="col">
              {columnNameDisplay}
          </th>
      )
      }
    })

    const itemsDisplay = items.map((item, index) => (
      <tr className={item.read === true ? 'read' : ''} key={index}>
        {
          columns.map((column, index) => {
            if (excludedColumnsList.indexOf(column) === -1) {
              let cellDisplay = item[column];
              if (column === 'filename') {
                  cellDisplay =(
                    <div className="img-thumbnail">
                      <img src={item[column]}/>
                    </div>
                  )
              } else if (column === 'created_at') {
                let today = new Date(item[column]);
                cellDisplay = today.getDate() + "."+ parseInt(today.getMonth()+1) +"."+today.getFullYear();
              }
              return(
                  <td key={index}>
                    {cellDisplay}
                  </td>
                )
            }
          })
        }
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
            <h1>{props.fetchUrl.split('/')[1]}</h1>
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
    } else {
      formDisplay = (
        <ItemForm
          columns={columns}
          selectedItem={selectedItem}
          onFinishFormSubmit={onFinishFormSubmit}
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
  const initMessages = [
    {type:'success', title:'susus'},
    {type:'warning', title:'wawaw'},
    {type:'error', title:'ererer'}
  ]
  const [messages, setMessages] = useState(initMessages)
}
export default DBTableRender;