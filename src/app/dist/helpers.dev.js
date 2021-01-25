"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderDisplayName = exports.renderTableColumnsArray = exports.breakArrayIntoChunksHelper = void 0;

var breakArrayIntoChunksHelper = function breakArrayIntoChunksHelper(perChunk, inputArray) {
  var result = inputArray.reduce(function (resultArray, item, index) {
    var chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);
    return resultArray;
  }, []);
  return result;
};

exports.breakArrayIntoChunksHelper = breakArrayIntoChunksHelper;

var renderTableColumnsArray = function renderTableColumnsArray(columns, table) {
  var cArray = [];
  columns.forEach(function (c, i) {
    if (c !== 'msg_id' && c !== 'picture_id') {
      var obj = {
        columnName: c,
        displayName: renderDisplayName(c, table),
        menuOnly: c === 'read' ? true : false
      };
      cArray.push(obj);
    }
  });
  return cArray;
};

exports.renderTableColumnsArray = renderTableColumnsArray;

var renderDisplayName = function renderDisplayName(word, table) {
  var translation = word;
  if (word === 'filename') translation = 'Bild';else if (word === 'picture_type') translation = 'Kategori';else if (word === 'price') translation = 'Pris';else if (word === 'caption') translation = 'Titel';else if (word === 'description') translation = 'Beskrivning';else if (word === 'msg') translation = 'Meddelande';else if (word === 'name') translation = 'Namn';else if (word === 'email') translation = 'Email';else if (word === 'read') translation = 'Läst';else if (word === 'messages') translation = 'Meddelanden';else if (word === 'pictures') translation = 'Bilder';else if (word === 'about') translation = 'Om mig';else if (word === 'created_at') {
    if (table === '/pictures') translation = 'Bild upplagd';else translation = 'Datum';
  }
  return translation;
};

exports.renderDisplayName = renderDisplayName;