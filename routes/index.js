var express = require('express');
var router = express.Router();
var User = require('../userStorage.js')

function routeBuilder(passport) {
    router.get('/', function (req, res) {
        if (req.user === undefined || req.user === null) {
            res.redirect("/login");
        }
        else {
            res.render('home.ejs', { user: req.user });
        }
    });
    router.get('/userNameExists', function (req, res) {
        var userName = req.query.username;
        User.findOne(userName).then(function (users) {
            var exists = true;
            if (!users || users.length === 0)
                exists = false;

            res.json({ userNameExists: exists });
        }).fail(function (err) {
            res.json({ userNameExists: true });
        });
    });
    router.post('/login',
    passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
    );
    router.get('/login', function (req, res) {
        var messages = prepareFlashMessages(req);
        res.render('login.ejs', { messages: messages });
    });
    router.get('/signup', function (req, res) {
        var messages = prepareFlashMessages(req);
        res.render('signup.ejs', { messages: messages });
    });
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    })
    );

    function prepareFlashMessages(req) {
        var messages = req.flash().message;
        var message = undefined;
        if (messages && messages.length > 0)
            message = messages[0];
        return { errorMessage: message };
    }

    return router;
}

module.exports = routeBuilder;
