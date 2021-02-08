var userController = require('../controllers/userController.js');
module.exports = function(app) {
    app.get("/api/users",userController.getUsers);
    app.get("/api/user/:id",userController.getUserById);
    app.post("/api/user/", userController.createUser);
    app.put("/api/user/:id",userController.updateUser);
    app.delete("/api/user/:id",userController.deleteUser);
}