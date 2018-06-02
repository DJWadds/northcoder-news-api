## Northcoders News API

### Background

This is the backend API for Northcoder News. This works with a MongoDB database. Hosted on Heroku and mlab.

### Mongoose Documentation

To find out more about how the backend works, it was built with MongoDB and the Documentation can be found below.

* [find](http://mongoosejs.com/docs/api.html#model_Model.find)
* [findOne](http://mongoosejs.com/docs/api.html#model_Model.findOne)
* [findById](http://mongoosejs.com/docs/api.html#model_Model.findById)
* [findByIdAndUpdate](http://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate)

### Step 1 - Seeding

Data has been provided for both testing and development environments so you will need to write a seed function to seed your database. You should think about how you will write your seed file to use either test data or dev data depending on the environment that you're running in.

1.  You will need to seed the topics, followed by the articles and the users. Each article should belong to a topic, referenced by a topic's \_id property. Each article should also have a random number of comments. Each comment should have been created by a random user (referenced by their \_id property) and should also belong to a specific article (referenced by its \_id property too). Use a library such as [faker](https://www.npmjs.com/package/faker) or [chance](https://www.npmjs.com/package/chance) to generate random comments.

### Step 2 - Building and Testing

1.  Build your Express App
2.  Mount an API Router onto your app
3.  Define the routes described below
4.  Define controller functions for each of your routes
5.  Use proper project configuration from the offset, being sure to treat development and test differently.
6.  Test each route as you go. Remember to test the happy and the unhappy paths! Make sure your error messages are helpful and your error status codes are chosen correctly. Remember to seed the test database using the seeding function and make the saved data available to use within your test suite.
7.  Once you have all your routes start to tackle responding with the vote and comment counts on article requests like this http://northcoders-news-api.herokuapp.com/api/articles

**HINT** Make sure to drop and reseed your test database with every test. This will make it much easier to keep track of your data throughout. In order for this to work, you are going to need to keep track of the MongoIDs your seeded docs have been given. In order to do this, you might want to consider what your seed file returns, and how you can use this in your tests.

### Routes

``` http
GET /api
```
Returns documentation for all the available endpoints in a sql page

/// Topics /////
``` http
GET /api/topics
```
Returns all the topics in the form {topics: [topic Object]}

``` http
GET /api/topics/:topic_id/articles
```
Returns all the articles for a certain topic in the form {articles: [article Object]}

``` http
POST /api/topics/:topic_id/articles
```
Add a new article to a topic. This route requires a JSON body with title and body key value pairs in the form {"title": "<input>", "body": "<input>"} and returns the new article in the form {articles: [{new Article}] }

/// Articles /////
``` http
GET /api/articles
```
Returns all articles in the form {articles: [article Object]}

``` http
GET /api/articles/:article_id
```
Returns an individual article in the form {articles: [article Object]}

``` http
GET /api/articles/:article_id/comments
```
Returns all the comments for a individual article in the form {comments: [comment Object]}

``` http
POST /api/articles/:article_id/comments
```
Add a new comment to an article. This route requires a JSON body with a comment key and value pair in the form {"body": "<input>"} and returns the comment and article in the form {data: [{Article}, {new comment}] }

``` http
PUT /api/articles/:article_id/:user_id
```
Adds the user id to the like or dislike array depending on the vote equalling like or dislike. This route requires a vote query of 'like' or 'dislike' and returns in the form {articles: [{Article}] }

/// Comments /////
``` http
PUT /api/comments/:comment_id/:user_id
```
Adds the user id to the like or dislike array depending on the vote equalling like or dislike. and returns in the form {comments: [{comment}] }

``` http
DELETE /api/comments/:comment_id
```
Delete a comment using its id, returns a {message: string, article: object} where the article shows the comments count minus one

/// Users /////
``` http
GET /api/users/:user_id/login
```
Returns the users in the form {users: [user]}

``` http
GET /api/users/
```
Returns all users

``` http
Post /api/users/:user_id/login
```
Creates new user by sending a username, name, avatar_url, password and returns new user

### Step 4 - Deployment

Built with:
  Javascript
  Mongoose
  MongoDB
  Promise
  Ejs

### Step 4 - Acknowledgments

Special thanks to Northcoders, their lecturers and my fellow students 
