const fs = require('fs');
const Portfolio = require('./blocks/portfolio');
const VARIABLES = require('./blocks/variables');
const mathjs = require('mathjs');

function writeScoredPortfolios() {
  const dataOnFile = JSON.parse(fs.readFileSync('public/raw-ports.json', 'utf8'));
  const investmentTools = dataOnFile.variables.investmentTools;
  var ports = dataOnFile.ports;
  
  ports = ports.map((port) => {
    return new Portfolio(
      port,
      VARIABLES.INVESTMENT_TOOLS
    );
  });

  ports = ports.filter((p) => {
    return p.annualGrowth > VARIABLES.MIN_ANNUAL_GROWTH;
  });

  ///
  const keys = [
    'annualGrowth',
    'annualIncome',
    'lowGrowthVarianceScore',
    'lowIncomeVarianceScore',
    'lowHeadacheScore',
    'liquidityScore'
  ];
  
  keys.forEach((key) => {
    portsKey = ports.map((p) => p[key]);
    portsKeyMean = mathjs.mean(portsKey);
    portsKeyStd = mathjs.std(portsKey);
    console.log(key, portsKeyMean, portsKeyStd);
    ports.forEach((p) => {
      p[key] = (p[key] - portsKeyMean)/portsKeyStd;
    });
  });

  ports.forEach((p) => {
    p["std_score"] = p._calculateOverallScore()
  });

  ports.forEach((p) => {
    p.calculateFeatures();
  });
  
  keys.forEach((key) => {
    portsKey = ports.map((p) => p[key]);
    portsKeyMin = mathjs.min(portsKey);
    portsKeyMax = mathjs.max(portsKey);
    console.log(key, portsKeyMin, portsKeyMax);
    ports.forEach((p) => {
      p[key] = (p[key] - portsKeyMin)/(portsKeyMax-portsKeyMin);
    });
  });

  ports.forEach((p) => {
    p["scaled_score"] = p._calculateOverallScore()
  });

  ports = ports.sort((p1, p2) => {
    return p2.scaled_score - p1.scaled_score;
  }).slice(0, 50000);
  
  ports.forEach((p) => {
    p.calculateFeatures(true);
  });

  ports = ports.map((p) => Object.values(p.toPojo()));

  fs.writeFileSync('public/scored-ports.json', JSON.stringify({
    data: ports
  }));
  console.log("total scored portfolios", ports.length);
}

writeScoredPortfolios();

module.exports = {
  writeScoredPortfolios,
};