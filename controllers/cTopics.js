const {Topics, Articles, Users} = require('../models');
const {ceateUsersIdArray} = require('../utils/formattingData');

exports.getAllTopics = (req, res, next) => {
    return Topics.find()
    .then(topics => {
        if( topics.length === 0) return next({status: 400});
        res.send({topics})
    })
    .catch(err => next({status: 400}));
};

exports.getAllArticlesByTopicId = (req, res, next) => {
    return Articles.find({belongs_to: req.params.topic_id}).
    populate('created_by').
    populate('belongs_to').
    exec()
    .then(articles => {
        if( articles.length === 0) return next({status: 400});
        const newarticles = articles.map(article => {
            article.created_by.password = undefined
            return article
        })
        res.send({articles});
    })
    .catch(err => next({status: 400}));
};

exports.postArticleByTopicID = (req, res, next) => {
    if (req.body.title === undefined || req.body.body === undefined) return next({status: 400});
    if (req.params.user_id === undefined || req.params.topic_id === undefined) return next({status: 404})  
        const newArticle = {
            'title': req.body.title, 
            'body': req.body.body,
            'belongs_to': req.params.topic_id,
            'likes': [], 
            'dislikes': [], 
            'created_by': req.params.user_id,
            'comments': 0    
        };
        Articles.create(newArticle)
        .then(article => {
            return Articles.find({_id: article.id}).
            populate('created_by').
            populate('belongs_to').
            exec()
        })
        .then(article => {
            res.status(201).send({article});
        })
    .catch(err => next({status: 400}));         

};