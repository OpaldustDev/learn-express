const express = require('express')
const router = express.Router();

// Handlers for reading users
router.get('/allUsers', function(req, res) {
    // Insert logic to retrieve all users
});

router.get('/specificUser/:userId', function(req, res) {
    // Insert logic to retrieve a specific user
    // The user's ID is available via req.params.userId
});

module.exports = router;