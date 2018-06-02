const express = require('express');
const articlesRouter = express.Router();
const {getAllArticles, getArticleById, getAllCommentsForArticleById, adjustArticleVoteById, postCommentByArticleID} =require('../controllers/cArticles');


articlesRouter.get('/', getAllArticles);
articlesRouter.get('/:article_id', getArticleById);
articlesRouter.get('/:article_id/comments', getAllCommentsForArticleById);
articlesRouter.post('/:article_id/comments/:user_id', postCommentByArticleID);
articlesRouter.put('/:article_id/:user_id', adjustArticleVoteById);

// NO ROUTE EXISTS
articlesRouter.use("/*", (req, res, next) => {
    next({ status: 404});
});

module.exports = articlesRouter;