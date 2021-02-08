var aboutController = require('../controllers/aboutController.js');
module.exports = function(app) {    
    app.get('/about', aboutController.getAbout)
    app.put('/about', aboutController.updateAbout)
}