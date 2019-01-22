const PortfolioGenerator = require('./blocks/portfolio-generator');
const VARIABLES = require('./blocks/variables');
// var MongoClient = require('mongodb').MongoClient;
// var url = process.env.MONGODB_URI || 'mongodb://localhost/optimal-portfolio';
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sqlite-db');

const generator = new PortfolioGenerator(
  VARIABLES.INVESTMENT_TOOLS,
  VARIABLES.ANNUAL_INCOME_RANGE
);

// MongoClient.connect(url, function(err, db) {
//   opdb = db.db('optimal-portfolio');
//   generator.writeAllPortfolios(opdb, db);
//   db.close();
// });

db.serialize(function() {
  db.run("CREATE TABLE portfolio (weights STRING)");

  generator.writeAllPortfolios(db);

  // db.each("SELECT weights FROM portfolio LIMIT 10", function(err, row) {
  //   console.log(JSON.parse(row.weights));
  // });
});

db.close();