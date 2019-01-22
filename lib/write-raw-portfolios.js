const PortfolioGenerator = require('./blocks/portfolio-generator');
const VARIABLES = require('./blocks/variables');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGODB_URI || 'mongodb://localhost/optimal-portfolio';

const generator = new PortfolioGenerator(
  VARIABLES.INVESTMENT_TOOLS,
  VARIABLES.ANNUAL_INCOME_RANGE
);

MongoClient.connect(url, function(err, db) {
  opdb = db.db('optimal-portfolio');
  generator.writeAllPortfolios(opdb);
  db.close();
});
