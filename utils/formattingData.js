const faker = require('faker');

exports.formatArticlesData = (articlesData, topicsNameRefferenceKey, usersIdsArray) => {
    return articlesData.map(article => {
        let {title, body, topic} = article;
        return {
            title, body,
            belongs_to: topicsNameRefferenceKey[topic],
            likes: [],
            dislikes: [],
            created_by: usersIdsArray[Math.floor(Math.random() * (usersIdsArray.length - 1))],
            comments: Math.floor(Math.random() * 20) + 1 
        };
    }); 
};

exports.createIdReferenceObjectForTopics = (docs) => {
  return docs.reduce((acc, item, i) => {
    acc[item.slug] = item._id;
    return acc;
  }, {});
};

exports.ceateUsersIdArray = (docs) => {
    return docs.reduce((acc, item, i) => {
        acc.push(item._id);
        return acc;
    }, []);
};

exports.ceateArticlessIdArray = (docs) => {
    return docs.reduce((acc, item, i) => {
        acc.push(item._id);
        return acc;
    }, []);
};

exports.createAllCommentsData = (articleDocs, usersIdsArray) => {
    const comments = [];
    articleDocs.forEach(article => {
        for (let i = 0; i < article.comments; i++) {
            let comment = randomCommentGenerator(article._id, usersIdsArray)
            comments.push(comment);
        }
    });
    return comments;
};

const randomCommentGenerator = (articleId, usersIdsArray) => {
    return {
            body: faker.random.words(),
            belongs_to: articleId,
            created_at: new Date().getTime(),
            votes: 0,
            created_by: usersIdsArray[Math.floor(Math.random() * (usersIdsArray.length - 1))],
      };
};

