## Northcoders News API

### Background

This is the backend API for Northcoder News. This works with a MongoDB database. Hosted on Heroku and mlab.

IMPORTANT
Before using the api locally you must have mongo running. Please type mongod into the terminal to get this running.

 Running the tests
Run npm test and the test will run.
To run the tests all you need to do is run the commend npm test, please note due to this being asyncrenous it may take longer than normal. You do not need to worry about reseeding the database before each test as this is done for you. To see more open the spec folder and see the index.spec.js file.
 
 Break down into end to end tests
Each test has two aspects, the first checks the route returns the right data 

Give an example
And coding style tests
Explain what these tests test and why
The tests are broken down by number and letter. the numbers refer to 
    1) /api
    2) /api/topics
    3) /api/article
    4) /api/comments
    5) /api/users

The letter then refers to which sub route is being tested. To understand each test better please read the comment in the it block. 

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

The test above is checking the /api/topics route which if it works should return an object with the key topics which holds an array of topic objects. It first checks the status returns as 200 and then waits for all the information to return. Finally it checks that the first and second objects have the right values. 

Special note
        let topicDocs, userDocs, articleDocs, commentDocs;
        let firstTopicDoc, firstUserDoc, firstArticleDoc, firstCommentDoc;
        beforeEach(() => {
        return seedDB(topicsData, usersData, articlesData)
        .then((data) => {
           [topicDocs, userDocs, articleDocs, commentDocs] = data;
            [[firstTopicDoc], [firstUserDoc], [firstArticleDoc], [firstCommentDoc]] = data;
        });
        });

The above runs before each test. It sets the XDocs to all the data returned from the database. Then the firstXDocs deconstructs to set these variables to the first item in each array. This allows better readability later on.

Deconstruction also takes place in the tests themselves.  
    { body: {topics: [firstTopic, secondTopic]} }

This looks inside the body finds the topics key, then looks inside that and sets the first two items in the array to the variables frstTopic and secondTopic. If there is a third topic this can still be accessed by using topics[2].

To use the Post, Put and Delete api's you will need postman https://www.getpostman.com/

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
