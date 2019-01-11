const ANNUAL_INCOME_RANGE = [0.055, 0.065];
const MIN_ANNUAL_GROWTH = 0.03;
const INVESTMENT_TOOLS = {
  insurance: {
    name: 'insurance',
    annualGrowth: 0.075,
    annualIncome: 0,
    lowGrowthVarianceScore: 5,
    lowIncomeVarianceScore: 5,
    lowHeadacheScore: 5,
    liquidityScore: 3
  },
  scss: {
    name: 'scss',
    annualGrowth: 0,
    annualIncome: .087,
    // @TODO might lead to wrong model since annualGrowth itself is 0, while this score is high
    lowGrowthVarianceScore: 5,
    lowIncomeVarianceScore: 5,
    lowHeadacheScore: 5,
    liquidityScore: 3,
    maxInvestment: .17,
  },
  fd: {
    name: 'fd',
    annualGrowth: .08,
    annualIncome: 0,
    lowGrowthVarianceScore: 5,
    lowIncomeVarianceScore: 5,    
    lowHeadacheScore: 5,
    liquidityScore: 4,
  },
  fd2: {
    name: 'fd2',
    annualGrowth: 0,
    annualIncome: .08,
    lowGrowthVarianceScore: 5,
    lowIncomeVarianceScore: 5,    
    lowHeadacheScore: 5,
    liquidityScore: 4,
  },
  mf: {
    name: 'mf',
    annualGrowth: .09,
    annualIncome: 0,
    lowGrowthVarianceScore: 2,
    lowIncomeVarianceScore: 3,
    lowHeadacheScore: 4,
    liquidityScore: 5,
  },
  mf2: {
    name: 'mf2',
    annualGrowth: 0,
    annualIncome: .09,
    lowGrowthVarianceScore: 2,
    lowIncomeVarianceScore: 3,
    lowHeadacheScore: 4,
    liquidityScore: 5,
  },
  realEstate: {
    name: 'realEstate',
    annualGrowth: .05,
    annualIncome: .06,
    lowGrowthVarianceScore: 2,
    lowIncomeVarianceScore: 1,
    lowHeadacheScore: 2,
    liquidityScore: 1,
  },
};

module.exports = {
  INVESTMENT_TOOLS,
  ANNUAL_INCOME_RANGE,
  MIN_ANNUAL_GROWTH,
};