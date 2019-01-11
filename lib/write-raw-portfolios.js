const PortfolioGenerator = require('./blocks/portfolio-generator');
const VARIABLES = require('./blocks/variables');

const generator = new PortfolioGenerator(
  VARIABLES.INVESTMENT_TOOLS,
  VARIABLES.ANNUAL_INCOME_RANGE
);
generator.writeAllPortfolios();