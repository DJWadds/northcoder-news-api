const express = require('express');
const commentsRouter = express.Router();
const {deleteCommentById, adjustCommentVoteById} =require('../controllers/cComments');


commentsRouter.put('/:comment_id/:user_id', (adjustCommentVoteById));
commentsRouter.delete('/:comment_id', deleteCommentById);


// NO ROUTE EXISTS
commentsRouter.use("/*", (req, res, next) => {
    next({ status: 404});
});

module.exports = commentsRouter;