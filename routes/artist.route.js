const express = require('express');
const routes = express.Router();
// const guard = require('express-jwt-permissions')();

const Artist = require('../models/artist.model');

routes.get('/', function (req, res) {
  Artist.find({})
    .then((artists) => {
      res.status(200).json(artists);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Could not find all artists" });
    });
});

routes.get('/:id', function (req, res) {
  const id = req.params.id;

  Artist.findById(id)
    .then((artist) => res.status(200).json(artist))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Could not find artist" });
    });
});

routes.post('/', function (req, res) {
  const payload = req.body;
  const artist = new Artist(payload);

  artist.save()
    .then(() => res.status(200).send(artist))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Could not create artist" })
    });
});

routes.put('/:id', function (req, res) {
  const id = req.params.id;
  const payload = req.body;

  Artist.findByIdAndUpdate(id, payload, { new: true })
    .then((artist) => {
      res.status(200).json(artist);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Could not update artist" });
    });
});

routes.delete('/', function (req, res) {
  Artist.remove({})
    .then(() => {
      res.status(200).json({ success: "All artists deleted" });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Could not delete all artists" });
    });
});

routes.delete('/:id', function (req, res) {
  const id = req.params.id;
  console.log('About to remove artist');

  Artist.findByIdAndRemove(id)
    .then((artist) => {
      console.log('Deleting artist ' + artist.name);
      res.status(200).json(artist);
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ error: "Could not delete artist with given ID" });
    });
});

module.exports = routes;
