passportjs-AzureTableStorge
===========================

A PassportJS strategy backed by Azure table storage.

Quick Start

express
npm install express-session
npm install passport
npm install passport-local
npm install azure-storage
npm install q
npm install bcrypt-nodejs
npm install connect-flash

```javascript

//...
//...
var session = require('express-session');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

//...
//...
//...
app.use(session());
//...
//...
//...

// Initialize Passport 
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require('./passport/init');
initPassport(passport);
app.use('/', routes(passport));

```