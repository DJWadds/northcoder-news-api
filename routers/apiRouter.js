const express = require('express');
const apiRouter = express.Router();
const topicsRouter = require('./topicsRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const usersRouter = require('./usersRouter');

apiRouter.get('/', (req, res, next) => {
    const apiRoutes = {
        API:    [   ['GET /api', 'Returns documentation for all the available endpoints in a sql page']],
        Topics: [   ['GET /api/topics', 'Returns all the topics in the form {topics: [topic Object]}'],    
                    ['GET /api/topics/topic_id/articles', 'Returns all the articles for a certain topic in the form {articles: [article Object]}'],
                    ['POST /api/topics/topic_id/articles/:user_id', 'Add a new article to a topic. This route requires a JSON body with title and body key value pairs in the form {"title": "<input>", "body": "<input>"} and returns the new article in the form {articles: [{new Article}] }']
                ],
        Articles: [ ['GET /api/articles', 'Returns all articles in the form {articles: [article Object]}'],
                    ['GET /api/articles/:article_id', 'Returns an individual article in the form {articles: [article Object]}'],
                    ['GET /:article_id/comments', 'Returns all the comments for a individual article in the form {comments: [comment Object]}'],
                    ['POST /api/articles/:article_id/comments/:user_id', 'Add a new comment to an article. This route requires a JSON body with a comment key and value pair in the form {"body": "<input>"} and returns the comment and article in the form {data: [{Article}, {new comment}] }'],
                    ['PUT /api/articles/:article_id/:user_id', "Adds the user id to the like or dislike array depending on the vote equalling like or dislike. This route requires a vote query of 'like' or 'dislike' and returns in the form {articles: [{Article}] }"]
                ],
        Comments: [ ['PUT /api/comments/:comment_id/:user_id', "Adds the user id to the like or dislike array depending on the vote equalling like or dislike. and returns in the form {comments: [{comment}] }"], 
                    ['DELETE /api/comments/:comment_id', 'Delete a comment using its id, returns a {message: string, article: object} where the article shows the comments count minus one']
                ],
        Users: [    ['GET /api/users/:user_id/login', 'Returns the users in the form {users: [user]}'],
                    ['GET /api/users/', 'Returns all users'],
                    ['Post /api/users/:user_id/login', 'Creates new user by sending a username, name, avatar_url, password and returns new user']
                ],
        keys: ['API', 'Topics', 'Articles', 'Comments', 'Users']
    };
    res.render('api.ejs', {apiRoutes})
});

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

// NO ROUTE EXISTS
apiRouter.use("/*", (req, res, next) => {
    next({ status: 404});
});

module.exports = apiRouter;


// {
//     '/api': []'get all the routes information',
//     '/api/topics': 'Returns all the topics in the database.',
//     '/api/:topid_id/articles': 'Can be used to fetch all the articles about a certain topic',
//     '/api/articles': 'Returns all the articles in the database',
//     '/api/articles/article_id': 'Returns an article based on its id',
//     '/api/users/user_id': 'Returns a user based on their id'
// }