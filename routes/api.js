// Dependencies
var express = require('express');

var router = express.Router();

// Models
var Tile = require('../models/tile')
Tile.methods(['get', 'put', 'post', 'delete']);
Tile.register(router, '/tiles')

module.exports = router;