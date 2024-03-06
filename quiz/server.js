const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 8000;

let users;

const fetchData = async() => {
  try {
    let data = await fs.readFile(path.resolve(__dirname, '../data/users.json'));
    users = JSON.parse(data);
  } catch (err) {
    console.error('Error reading file', err);
  }
}

fetchData();

const addMsgToRequest = function (req, res, next) {
  if(users) {
    req.users = users;
    next();
  }
  else {
    res.status(404).json({
      error: {message: 'users not found', status: 404}
    });
  }
}

app.use(
    cors({origin: 'http://localhost:3000'}),
    addMsgToRequest
);

app.get('/read/usernames', (req, res) => {
  let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username};
  });
  res.json(usernames);
});

app.get('/read/username/:name', (req, res) => {
  let user = req.users.find(function(user) {
    return user.username === req.params.name;
  });
  if(user) {
    res.json({username: user.username, email: user.email});
  } else {
    res.status(404).json({error: 'User not found', status: 404});
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/write/adduser', (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})