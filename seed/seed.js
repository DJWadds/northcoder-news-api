const mongoose = require('mongoose');
const { Topics, Users, Articles, Comments } = require('../models');
const { formatArticlesData, createIdReferenceObjectForTopics, ceateUsersIdArray, createAllCommentsData } = require('../utils/formattingData');

function seedDB(topicsData, usersData, articlesData) {
    return mongoose.connection
    .dropDatabase()
    .then(() => {
        console.log('database dropped');
        return Promise.all([
            Topics.insertMany(topicsData),
            Users.insertMany(usersData)
        ]);
    })
    .then(([topicDocs, userDocs]) => {
        console.log(`inserted ${topicDocs.length} topics`);
        console.log(`inserted ${userDocs.length} users`);
        const topicsNameRefferenceKey = createIdReferenceObjectForTopics(topicDocs);
        const usersIdsArray = ceateUsersIdArray(userDocs);
        const formattedArticlesData = formatArticlesData(articlesData, topicsNameRefferenceKey, usersIdsArray)
        return Promise.all([
            topicDocs,
            userDocs,
            Articles.insertMany(formattedArticlesData),
            usersIdsArray
        ]);
    })
    .then(([topicDocs, userDocs, articleDocs, usersIdsArray]) => {
        console.log(`inserted ${articleDocs.length} articles`);
        const commentsData = createAllCommentsData(articleDocs, usersIdsArray);
        return Promise.all([
            topicDocs,
            userDocs,
            articleDocs,
            Comments.insertMany(commentsData)
        ]);
    })
    .then(([topicDocs, userDocs, articleDocs, commentDocs]) => {
        console.log(`inserted ${commentDocs.length} comments`);
        return [topicDocs, userDocs, articleDocs, commentDocs];
    });
}

module.exports = seedDB;