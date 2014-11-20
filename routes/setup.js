var express = require('express');
var router = express.Router();


router.get('/', function (req, res) {
    if (req.user === undefined || req.user === null) {
        res.redirect("/login");
    }
    res.render("setup/setup.ejs");
});

module.exports = router;