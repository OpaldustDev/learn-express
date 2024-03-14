const bodyParser = require('body-parser');
const express = require('express')
const fs = require('fs');
const path = require('path');
const router = express.Router();

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

router.post('/', function (req, res) {
    // retrieve user posted data from the body
    var user = req.body;
    fs.readFile(__dirname + "/" + "users.json", 'utf8', function (err, data) {
        data = JSON.parse(data);
        data["user" + user.id] = user;
        fs.writeFile(__dirname + "/" + "users.json", JSON.stringify(data), function (err) {
            console.log(err);
        });
    });
    res.end("Added user successfully");
});

module.exports = router;