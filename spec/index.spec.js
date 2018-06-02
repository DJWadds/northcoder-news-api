process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest')(app);
const { expect } = require('chai');
const { articlesData, topicsData, usersData } = require('../seed/testData');
const seedDB = require('../seed/seed');
const mongoose = require('mongoose');

describe('/', () => {
    let topicDocs, userDocs, articleDocs, commentDocs;
    let firstTopicDoc, firstUserDoc, firstArticleDoc, firstCommentDoc;
    beforeEach(() => {
      return seedDB(topicsData, usersData, articlesData)
      .then((data) => {
        [topicDocs, userDocs, articleDocs, commentDocs] = data;
        [[firstTopicDoc], [firstUserDoc], [firstArticleDoc], [firstCommentDoc]] = data;
      });
    });
    after(() => mongoose.disconnect());

    describe('1. /api', () => {
        // it('1a. get /api returns all the possible routes', () => {
        //     return request
        //     .get(`/api`)
        //     .expect(200)
        //     .then(({ body }) => {
        //         expect(body['/api']).to.equal('get all the routes information');
        //         expect(body['/api/topics']).to.equal('Returns all the topics in the database.');  
        //     });
        // });
    });

    describe('2. /api/topics', () => {
        it('2a. get /api/topics returns all the possible topics', () => {
            return request
            .get(`/api/topics`)
            .expect(200)
            .then(({ body: {topics: [firstTopic, secondTopic]} }) => {
                expect(firstTopic.title).to.equal('Mitch');
                expect(firstTopic.slug).to.equal('mitch');
                expect(secondTopic.title).to.equal('Cats');
                expect(secondTopic.slug).to.equal('cats');
            });
        });
        it('2a- error. get /api/topic returns error', () => {
            return request
            .get(`/api/topic`)
            .expect(404);
        });
        it('2b- error. get /api/topics/topic_id/articles returns error', () => {
            return request
            .get(`/api/topics/jhgjnsethjgv/articles`)
            .expect(400);
        });
        it('2b. get /api/topics/topic_id/articles returns a list of all the articles based on that topic', () => {
            return request
            .get(`/api/topics/${firstArticleDoc.belongs_to}/articles`)
            .expect(200)
            .then(({ body: {articles: [article]} }) => {
                expect(article.title).to.equal(firstArticleDoc.title);
                expect(article._body).to.equal(firstArticleDoc._body);
                expect(article.comments).to.equal(firstArticleDoc.comments);
            });
        });
        it('2b- error. get /api/topics/topic_id/articles returns error', () => {
            return request
            .get(`/api/topics/fdhjvnf/articles`)
            .expect(400);
        });
        it('2c. post /api/topics/topic_id/articles adds an article given the topics id', () => {
            return request
            .post(`/api/topics/${firstArticleDoc._id}/articles/${firstUserDoc._id}`)
            .send({title: 'This is the title', body: 'Some text'})
            .expect(201)
            .then(({ body: {article} }) => {
                article = article[0]
                expect(article.likes).to.eql([]);
                expect(article.dislikes).to.eql([]);
                expect(article.comments).to.equal(0);
                expect(article.title).to.equal('This is the title');
                expect(article.body).to.equal('Some text');
            });
        });
    });

    describe('3. /api/articles', () => {
        it('3a. get /api/articles returns all the possible articles', () => {
            return request
            .get(`/api/articles`)
            .expect(200)
            .then(({ body: {articles: [firstArticle]} }) => {
                expect(firstArticle.likes).to.eql([]);
                expect(firstArticle.dislikes).to.eql([]);
                expect(firstArticle.title).to.equal('Living in the shadow of a great man');
                expect(firstArticle.body).to.equal('I find this existence challenging');
            });
        });
        it('3a- error. get /api/articles returns error', () => {
            return request
            .get(`/api/article`)
            .expect(404);
        });
        it('3b. get /api/articles/article_id returns a article based on id', () => {
            return request
            .get(`/api/articles/${firstArticleDoc._id}`)
            .expect(200)
            .then(({ body: {articles: [article]} }) => {
                expect(article.title).to.equal(firstArticleDoc.title);
                expect(article.body).to.equal(firstArticleDoc.body);
                expect(article.comments).to.equal(firstArticleDoc.comments);
            });
        });
        it('3b- error. get /api/articles/article_id returns error', () => {
            return request
            .get('/api/articles/fghejh8fgdj')
            .expect(404)
        });
        it('3c. get /api/articles/article_id/comments returns all comments based on article id', () => {
            return request
            .get(`/api/articles/${firstCommentDoc.belongs_to}/comments`)
            .expect(200)
            .then(({ body: {comments: [comment]} }) => {
                expect(comment.body).to.equal(firstCommentDoc.body);
                expect(comment._id).to.equal((firstCommentDoc._id).toString());
            });
        });
        it('3c- error. get /api/articles/article_id/comments returns error', () => {
            return request
            .get(`/api/articles/dfkdjghkdc/comments`)
            .expect(404)
        });
        it('3d. post /api/articles/article_id/comments adds a comment to the article id and increases comment count by one', () => {
            return request
            .post(`/api/articles/${firstArticleDoc._id}/comments/${firstUserDoc._id}`)
            .send({body: 'this is a comment'})
            .expect(201)
            .then(({ body: {data: [returnedArticle, returnedComment] }}) => {
                const [articleDoc] = articleDocs.filter(article => article._id === firstArticleDoc._id)
                expect(returnedArticle.comments).to.equal((articleDoc.comments) + 1);
                expect(returnedArticle.likes).to.eql([]);
                expect(returnedArticle.dislikes).to.eql([]);
                expect(returnedComment.body).to.equal('this is a comment');
                expect(returnedComment.belongs_to).to.eql((firstArticleDoc._id).toString());
            });
        });
        it('3e. put /api/articles/article_id/user_id vote=like returns the article with likes including the user id in the array', () => {
            return request
            .put(`/api/articles/${firstArticleDoc._id}/${firstUserDoc._id}?vote=like`)
            .expect(202)
            .then(({body: {article}}) => {
                expect(article._id).to.equal((firstArticleDoc._id).toString());
                expect(article.body).to.equal(firstArticleDoc.body);
                expect(article.title).to.equal(firstArticleDoc.title);
                const likeArray = [firstUserDoc._id.toString()];
                expect(article.likes).to.eql(likeArray);
            });
        });
        it('3f. put /api/articles/article_id/user_id vote=dislike returns the article with vote decreased by 1 based on vote queryreturns the article with dislikes including the user id in the array', () => {
            return request
            .put(`/api/articles/${firstArticleDoc._id}/${firstUserDoc._id}?vote=dislike`)
            .expect(202)
            .then(( {body: {article}} ) => {
                expect(article._id).to.equal((firstArticleDoc._id).toString());
                expect(article.body).to.equal(firstArticleDoc.body);
                expect(article.title).to.equal(firstArticleDoc.title);
                const dislikeArray = [firstUserDoc._id.toString()];
                expect(article.dislikes).to.eql(dislikeArray);
            });
        });
    });

    describe('4. /api/comments', () => {
        it('4a. put /api/comments/:comment_id/:user_id?vote=up vote=like returns the comment with likes including the user id in the array', () => {
            return request
            .put(`/api/comments/${firstCommentDoc._id}/${firstUserDoc._id}?vote=like`)
            .expect(202)
            .then(({ body: {comment} }) => {
                expect(comment._id).to.equal((firstCommentDoc._id).toString());
                expect(comment.body).to.equal(firstCommentDoc.body);
                const likeArray = [firstUserDoc._id.toString()];
                expect(comment.likes).to.eql(likeArray);
            });
        });
        it('4b. put /api/comments/:comment_id/:user_id?vote=up vote=dislike returns the comment with dislikes including the user id in the array', () => {
            return request
            .put(`/api/comments/${firstCommentDoc._id}/${firstUserDoc._id}?vote=dislike`)
            .expect(202)
            .then(({ body: {comment} }) => {
                expect(comment._id).to.equal((firstCommentDoc._id).toString());
                expect(comment.body).to.equal(firstCommentDoc.body);
                const dislikeArray = [firstUserDoc._id.toString()];
                expect(comment.dislikes).to.eql(dislikeArray);
            });
        });
        it('4c. delete /api/comments/:comment_id returns a message informing you the comment has been deleted and decreases the articles comments count by 1', () => {
            return request
            .delete(`/api/comments/${firstCommentDoc._id}`)
            .expect(200)
            .then(({ body: {article: returnedArticle, message} }) => {
                const [articleDoc] = articleDocs.filter(article => firstCommentDoc.belongs_to === article._id)
                expect(returnedArticle.votes).to.equal(articleDoc.votes)
                expect(message).to.equal(`Deleted comment ${firstCommentDoc._id}`);
            });
        });
    });

    describe('5. /api/users', () => {
        it('5a. get /api/users/ returns all the users', () => {
            return request
            .get(`/api/users`)
            .expect(200)
            .then(({ body: {users} }) => {
                expect(users[0]._id).to.equal((firstUserDoc._id).toString());
                expect(users[0].username).to.equal(firstUserDoc.username);
                expect(users[0].name).to.equal(firstUserDoc.name);
            });
        });
        it('5b. get /api/users/:user_id returns the user based on their id', () => {
            return request
            .get(`/api/users/${firstUserDoc._id}/login?password=password`)
            .expect(200)
            .then(({ body: {users: [user]} }) => {
                expect(user._id).to.equal((firstUserDoc._id).toString());
                expect(user.username).to.equal(firstUserDoc.username);
                expect(user.name).to.equal(firstUserDoc.name);
                expect(user.avatar_url).to.equal(firstUserDoc.avatar_url);
            });
        });
        it('5c. Post /api/users/ adds a new user and returns the user', () => {
            return request
            .post('/api/users')
            .send({username: 'username', name: 'name', password:'password', avatar_url: 'avatar_url'})
            .expect(201)
            .then(({body: data}) => {
                const user = data.user
                expect(user.username).to.equal('username');
                expect(user.name).to.equal('name');
                expect(user.avatar_url).to.equal('avatar_url');
            });
        });
    });
});