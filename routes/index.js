var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || 'mongodb://localhost/optimal-portfolio';
var opdb;

MongoClient.connect(url, function(err, db) {
  opdb = db.db('optimal-portfolio');
});

// var Portfolio = require('../lib/generate-portfolios');

// get the portfolios as written on the file
router.get('/ajax', function(req, res, next) {
  // let portfolios = Portfolio.genPortfolios;
  res.render('index');
});

router.get('/get-scored-ports', function(req, res, next) {
  // let portfolios = Portfolio.genPortfolios;
  opdb.collection('portfolio').find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get portfolios.");
    } else {
      res.status(200).json({ data: docs });
    }
  });
});

// get the portfolios as written on the file, 
// and apply a different scoring function
router.get('/scores', function(req, res, next) {
  // res.setHeader('Content-Type', 'application/json');
  res.render('index2');
});

module.exports = router;

// generate portfolios for given tools <-> annualIncome && given total-income range

// read portfolios
// apply scoring function
// return portfolios