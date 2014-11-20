var LocalStrategy = require('passport-local').Strategy;
var User = require('../storage/userStorage.js');
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {    
    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function (req, userName, password, done) {
            
            findOrCreateUser = function () {
                // find a user in Mongo with provided username
                User.findOne(userName).then(function (user) {                    
                    // already exists
                    if (user) {
                        console.log('User already exists with username: ' + username);
                        return done(null, false, req.flash('message', 'User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = User.UserFactory();
                        
                        // set the user's local credentials
                        newUser.userName = userName;
                        newUser.password = User.createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstName = req.param('firstName');
                        newUser.lastName = req.param('lastName');

                        
                        // save the user
                        User.createUser(newUser).then(function (err) {                            
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        }).fail(function (err) { 
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }    
                        });
                    }
                }).fail(function (err) { 
                    // In case of any error, return using the done method
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }    
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );
    
    

}
