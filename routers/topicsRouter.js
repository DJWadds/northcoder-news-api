const express = require('express');
const topicsRouter = express.Router();
const {getAllTopics, getAllArticlesByTopicId, postArticleByTopicID} =require('../controllers/cTopics');


topicsRouter.get('/', getAllTopics);
topicsRouter.get('/:topic_id/articles', getAllArticlesByTopicId);
topicsRouter.post('/:topic_id/articles/:user_id', postArticleByTopicID);

// NO ROUTE EXISTS
topicsRouter.use("/*", (req, res, next) => {
    next({ status: 404});
});

module.exports = topicsRouter;