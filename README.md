passportjs-AzureTableStorge
===========================

A PassportJS strategy backed by Azure table storage.

Quick Start
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

```