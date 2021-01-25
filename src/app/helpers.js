export const breakArrayIntoChunksHelper = (perChunk, inputArray)=>{
    var result = inputArray.reduce((resultArray, item, index) => { 
      const chunkIndex = Math.floor(index/perChunk)
      if(!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = [] // start a new chunk
      }
      resultArray[chunkIndex].push(item)
      return resultArray
    }, [])
    return result
}

export const renderTableColumnsArray = (columns, table) => {
  let cArray = []
  columns.forEach(function(c, i){
      if (c !== 'msg_id' && c !== 'picture_id') {
        const obj = {
          columnName: c,
          displayName: renderDisplayName(c, table),
          menuOnly: c === 'read' ? true : false,
        }
        cArray.push(obj)
      }
  })
  return cArray
}

export const renderDisplayName = (word, table) => {
  let translation = word
    if (word === 'filename') translation = 'Bild';
    else if (word === 'picture_type') translation = 'Kategori';
    else if (word === 'price') translation = 'Pris';
    else if (word === 'caption') translation = 'Titel';
    else if (word === 'description') translation = 'Beskrivning';
    else if (word === 'msg') translation = 'Meddelande';
    else if (word === 'name') translation = 'Namn';
    else if (word === 'email') translation = 'Email';
    else if (word === 'read') translation = 'Läst';
    else if (word === 'messages') translation = 'Meddelanden';
    else if (word === 'pictures') translation = 'Bilder';
    else if (word === 'about') translation = 'Om mig'
    else if (word === 'created_at') {
      if (table === '/pictures') translation = 'Bild upplagd'
      else translation = 'Datum'
    }

  return translation;
}