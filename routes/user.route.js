const express = require('express');
const routes = express.Router();

const authorizer = require('../helpers/authorizer');
const hasher = require('../helpers/hasher');
const User = require('../models/user.model');
const Concert = require('../models/concert.model');

routes.get('/', function (req, res) {
  User.find({})
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not find all users"})
    });
});

routes.get('/:id', function (req, res) {
  const id = req.params.id;

  User.findById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(_ => {
      res.status(403).json({error: "Not authorized"})
    });
});

routes.post('/', function (req, res) {
  let password = req.body.password;
  let user = new User(req.body);

  hasher.hash(password, (hash) => {
    user.password = hash;

    user.save()
      .then(() => {
        console.log('User with email: "' + req.body.email + '" created');
        res.status(200).json(user)
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json({error: "Could not create user"})
      })
  });
});

routes.post('/:id/tickets', function(req, res) {
  const id = req.params.id;
  const ticket = req.body;

  User.findById(id)
    .then((user) => {

      console.log(user);

      user.tickets.push(ticket);
      const saveUserTickets = user.save();
      const concertId = req.body.concert;
      let ticketAmount = 0;

      for (const item of ticket.items) {
        ticketAmount += item.amount;
      }

      let subtractConcertTickets;
      Concert.findById(concertId)
        .then(concert => {

            console.log(concert);

            concert.ticketsRemaining = concert.ticketsRemaining - ticketAmount;
            subtractConcertTickets = concert.save();

          Promise.all([saveUserTickets, subtractConcertTickets])
            .then(result => {
              console.log(result);
              res.status(200).send(result);
            })
            .catch(err => {
              console.log(err);
              res.status(409).send(err.message);
            });
        })
        .catch(err => console.log(err));
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ error: 'Could not find user' })
    })
});

routes.put('/:id', function (req, res) {
  const id = req.params.id;
  const payload = req.body;

  User.findByIdAndUpdate(id, payload, { new: true })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not update user with given ID"})
    });
});

routes.delete('/', function (req, res) {
  User.remove({})
    .then(() => {
      res.status(200).json({success: "All users deleted"})
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({error: "Could not delete all users"})
    });
});

routes.delete('/:id', function (req, res) {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then((user) => {
      authorizer.isSelf(req, user)
        .then(_ => {
          res.status(200).json(user);
        })
        .catch(_ => {
          res.status(403).json({error: "Not authorized"})
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({error: "Could not delete user with given ID"})
    });
});

module.exports = routes;
