var messageController = require('../controllers/messageController.js');
module.exports = function(app) {    
    app.post('/messages', messageController.createMessage)
    app.get('/messages', messageController.getMessages)
    app.get('/countreadmsg', messageController.countReadMsg)
    app.put('/messages/:id', messageController.updateMessages)
    app.delete('/messages/:id', messageController.deleteMessage)
}