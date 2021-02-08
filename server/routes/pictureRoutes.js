var pictureController = require('../controllers/pictureController.js');
module.exports = function(app) {
    app.get('/pictures', pictureController.getPictures)
    app.get('/pictures/:picture_type', pictureController.getPicturesByType)
    app.post('/pictures', pictureController.createPicture)
    app.delete('/pictures/:id', pictureController.deletePicture)
    app.put('/pictures/:id', pictureController.updatePicture)    
}