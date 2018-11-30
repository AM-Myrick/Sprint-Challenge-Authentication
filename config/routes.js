const axios = require('axios');
const bcrypt = require("bcryptjs");
const knex = require("knex");
const knexConfig = require("../knexfile");
const db = knex(knexConfig.development);

const { authenticate, generateToken } = require('./middlewares');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  const creds = req.body;

  if (creds.username === "" || creds.username === undefined) {
    return res.status(400).json({error: "Please enter a username."})
  }

  if (creds.password === "" || creds.password === undefined) {
    return res.status(400).json({error: "Please enter a password."})
  }

  const hash = bcrypt.hashSync(creds.password, 8);
  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => res.status(201).json({message: "welcome", ids}))
    .catch(err => res.status(401).json(err))
}

function login(req, res) {
  const creds = req.body;

  if (creds.username === "" || creds.username === undefined) {
      return res.status(400).json({error: "Please enter a username."})
  }

  if (creds.password === "" || creds.password === undefined) {
      return res.status(400).json({error: "Please enter a password."})
  }

  db('users')
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: 'welcome!', token });
      } else {
        res.status(401).json({ message: 'you shall not pass!!' });
      }
    })
    .catch(err => res.json(err));
}

function getJokes(req, res) {
  axios
    .get(
      'https://safe-falls-22549.herokuapp.com/random_ten'
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}