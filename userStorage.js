//Implimented from https://github.com/expressjs/session
//                 https://github.com/tj/connect-redis

//TODO : needs to chache the get and throttle the set

var azure = require("azure-storage");
var q = require('q');
var config = require('../config.js');
var bCrypt = require('bcrypt-nodejs');


function User() { }
    
User.UserFactory = function() {
    var user = {
        userName : "",
        password : "",
        enabled : true,
        email : "",
        tenant : "",
        verified : false
    };
    user.isValidPassword = User.isValidPassword;
    return user;
}
    

User.findOne = function (userName) {
    var tableService = azure.createTableService(config.storageAccountKey);
    var deferred = q.defer();    
    tableService.retrieveEntity('CloudUser', userName, 'true', function (err, result) {
        if (err) {
            if (err.statusCode === 404)
                deferred.resolve(undefined);
            else
                deferred.reject(err);
        } 
        else {
            deferred.resolve(User.toUser(result));                
        }
    });
    return deferred.promise;
}
 
User.toUser = function (userEntity) {
    var user = User.UserFactory();
    user.userName = userEntity.PartitionKey._;
    user.enabled = userEntity.RowKey._;
    user.password = userEntity.password._;
    //user.email = userEntity.email._;
    user.tenant = userEntity.tenant._;
    //user.validated = userEntity.validated._;
    return user;
};
    
User.toUserEntity = function (user) {
    return {
        PartitionKey: { '_': user.userName },
        RowKey: { '_': 'true' },
        password: { '_': user.password },
        //email: { '_': user.email },
        tenant: { '_': user.tenant },
        //validated: { '_': user.validated }
    };
};
    
User.createUser = function (user) {
    var deferred = q.defer();
    var tableService = azure.createTableService(config.storageAccountKey);
    function create(user) {                        
        tableService.insertEntity('CloudUser', User.toUserEntity(user), function (err, result) {
            if (err) {
                deferred.reject({ status: false, reason: "error creating user", err: err });
            } 
            else {
                deferred.resolve({ status: true, reason: "" });
            }
        });
    }

    User.findOne(user.userName).then(function (result) {
        if (result && result.length > 1) {
            deferred.resolve({ status: false, reason: "username exists" });
        }
        else {
            create(user);
        }
    }).
    fail(function (err) {
            deferred.reject({ status: false, reason: "error creating user", err: err});
    });

    return deferred.promise;
}
    
User.save = function (user) {
    var tableService = azure.createTableService(config.storageAccountKey);
    tableService.updateEntity('CloudUser', user, function (err, result) {
        if (err) {
            deferred.reject({ status: false, reason: "error creating user" });
        } 
        else {
            deferred.resolve({ status: true, reason: "" });
        }
    });
}
    
User.isValidPassword = function (user, password) {
    return bCrypt.compareSync(password, user.password);
}
    
// Generates hash using bCrypt
User.createHash = function (password) {
    return bCrypt.hashSync(password);
}

module.exports = User;
