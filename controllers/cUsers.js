const {Users} = require('../models');

exports.getUserLogin = (req, res, next) => {
    return Users.find({_id: req.params.user_id}).lean()
    .then(users => {
        if (req.query.password === users[0].password) {
            const mappedUsers = users.map(({password, ...user}) => {
                return user
            })
            res.send({users: mappedUsers});
        }
        res.send({message: 'password incorrect'});
    })
    .catch(() => next({status: 404}));
};

exports.getAllUsers = (req, res, next) => {
    return Users.find().lean()
    .then(users => {
        const mappedUsers = users.map(({password, avatar_url, ...user}) => {
            return user
        })

        
        res.send({users: mappedUsers});
    })
    .catch(() => next({status: 404}));
};

exports.addNewUser = (req, res, next) => {
    if (req.body.username === undefined || req.body.name === undefined ||
        req.body.password === undefined || req.body.avatar_url === undefined
    ) {
        return next({status: 404});
    } 
    else {
        const user = {
            username: req.body.username,
            name: req.body.name,
            avatar_url: req.body.avatar_url,
            password: req.body.password
        }
        Users.create(user)
        .then((user) => {
            const newUser = {
                username: user.username,
                name: user.name,
                avatar_url: user.avatar_url,
                _id: user._id 
            }
            res.status(201).send({user: newUser});
        })
        .catch(err => next({status: 404}));         
    }
};
