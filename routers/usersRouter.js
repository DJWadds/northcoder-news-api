const express = require('express');
const usersRouter = express.Router();
const {getUserLogin, getAllUsers, addNewUser} =require('../controllers/cUsers');

usersRouter.get('/', getAllUsers);
usersRouter.post('/', addNewUser);
usersRouter.get('/:user_id/login', getUserLogin);

// NO ROUTE EXISTS
usersRouter.use("/*", (req, res, next) => {
    next({ status: 404});;
});

module.exports = usersRouter;