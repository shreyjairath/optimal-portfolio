var express = require('express');
var router = express.Router();
// var Portfolio = require('../lib/generate-portfolios');

// get the portfolios as written on the file
router.get('/ajax', function(req, res, next) {
  // let portfolios = Portfolio.genPortfolios;
  res.render('index2');
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