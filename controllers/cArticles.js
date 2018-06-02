const {Articles, Comments, Users} = require('../models');
const {ceateUsersIdArray} = require('../utils/formattingData');

exports.getAllArticles = (req, res, next) => {
    return Articles.find().
    populate('created_by').
    populate('belongs_to').
    exec()
    .then(articles => {
        res.send({articles})
    })
    .catch(() => next({status: 404}));
};

exports.getArticleById = (req, res, next) => {
    return Articles.find({_id: req.params.article_id}).
    populate('created_by').
    populate('belongs_to').
    exec()
    .then(articles => {
        if (articles.length !== 1) return next({status: 404});
        res.send({articles});
    })
    .catch(() => next({status: 404}));
};

exports.getAllCommentsForArticleById = (req, res, next) => {
    return Comments.find({belongs_to: req.params.article_id}).
    populate('created_by').
    populate('belongs_to').
    exec()
    .then(comments => {
        res.send({comments});
    })
    .catch(err => next({status: 404}));
};

exports.postCommentByArticleID = (req, res, next) => {
    if (req.body.body === undefined) return next({status: 404});
    if (req.params.user_id === undefined || req.params.article_id === undefined) return next({status: 404})  
    const newComment = {
        'body': req.body.body,
        'belongs_to': req.params.article_id,
        'votes': 0, 
        'created_at': new Date().getTime(),
        'created_by': req.params.user_id 
    };
    return Promise.all([Articles.findByIdAndUpdate(req.params.article_id, { $inc: { comments: +1 }}, {new: true}), Comments.create(newComment)])
    .then(data => {
        if (data.length !== 2) return next({status: 500});
        res.status(201).send({data});
    })
    .catch(err => next({status: 404}))
};

exports.adjustArticleVoteById = (req, res, next) => {
    return Articles.find({_id: req.params.article_id})
    .then(article => {
        if (req.query.vote === 'like') {        
            Articles.findByIdAndUpdate(req.params.article_id, { $push: {likes: req.params.user_id}}, {new: true}, (err, article) => {
                if (err) return handleError(err);
                res.status(202).send({article});
            })
        } else if (req.query.vote === 'dislike') {
            Articles.findByIdAndUpdate(req.params.article_id, { $push: {dislikes: req.params.user_id}}, {new: true}, (err, article) => {
                if (err) return handleError(err);
                res.status(202).send({article});
            })
        }
    })
    .catch(err => next({status: 404}));
};

