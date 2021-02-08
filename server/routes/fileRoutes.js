var fileController = require('../controllers/fileController.js');
module.exports = function(app) {
    // app.post('/upload',fileController.uploadFile)
    app.post('/delete',fileController.deleteFile)
}