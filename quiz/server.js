const express = require('express');
const readUsersRouter = express.Router();

readUsersRouter.get('/read/usernames', (req, res) => {
  let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username};
  });
  res.json(usernames);
});

readUsersRouter.get('/read/username/:name', (req, res) => {
  let user = req.users.find(function(user) {
    return user.username === req.params.name;
  });

  if(user) {
    res.json({username: user.username, email: user.email});
  } else {
    res.status(404).json({error: 'User not found', status: 404});
  }
});

module.exports = readUsersRouter;
const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const writeUsersRouter = express.Router();

writeUsersRouter.use(express.json());
writeUsersRouter.use(express.urlencoded({ extended: true }));

writeUsersRouter.post('/write/adduser', (req, res) => {
  // perform validation here

  let newuser = req.body;

  if (!newuser || !newuser.username || !newuser.email) {
    res.status(400).send('Bad request');
    return;
  }
  req.users.push(newuser);

  fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users))
      .then(() => console.log('User Saved'))
      .catch(err => console.error('Failed to write', err));

  res.send('done');
})

module.exports = writeUsersRouter;
const express = require('express');
const cors = require('cors');
const readUsersRouter = require('./readUsers');
const writeUsersRouter = require('./writeUsers');
const port = 8000;
const app = express();
let users;

// ... rest of your code

app.use(
    cors({origin: 'http://localhost:3000'}),
    addMsgToRequest,
    readUsersRouter,
    writeUsersRouter
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});