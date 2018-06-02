const {Comments, Articles} = require('../models');

exports.deleteCommentById = (req, res, next) => {
    return Comments.find({_id: req.params.comment_id})
    .then(comment => {
        if (comment.length !== 1) return next({status: 404});
        const articleId = comment[0].belongs_to;
        return Promise.all([Articles.findByIdAndUpdate(articleId, { $inc: { comments: -1 }}, {new: true}), Comments.deleteOne({_id: req.params.comment_id})]);
    })
    .then(([article, data]) => {
        if (typeof article !== 'object') return next({status: 500});
        return Promise.all([Comments.find(), article]);
    })
    .then(([commentDocs, article]) => {
        const commentPresenceChecker = commentDocs.filter(comment => comment._id === req.params.comment_id)
        if (commentPresenceChecker.length > 0) {
            res.send({message: 'Something went grone and your comment still exists. Not sure why but we are looking into it'});
        } else {
            res.send({article, message: `Deleted comment ${req.params.comment_id}`});
        }  
    })
    .catch(err => next({status: 400}));
};

exports.adjustCommentVoteById = (req, res, next) => {
    return Comments.find({_id: req.params.comment_id})
    .then(comment => {
        if (req.query.vote === 'like') {        
            Comments.findByIdAndUpdate(req.params.comment_id, { $push: {likes: req.params.user_id}}, {new: true}, (err, comment) => {
                if (err) return handleError(err);
                res.status(202).send({comment});
            })
        } else if (req.query.vote === 'dislike') {
            Comments.findByIdAndUpdate(req.params.comment_id, { $push: {dislikes: req.params.user_id}}, {new: true}, (err, comment) => {
                if (err) return handleError(err);
                res.status(202).send({comment});
            })
        }
    })
    .catch(err => next({status: 404}));
};