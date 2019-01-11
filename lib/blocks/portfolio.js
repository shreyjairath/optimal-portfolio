const TIME_HORIZON_YEARS = 10;
// investmentToolName => weight
// annualIncome
// annualGrowth
// incomeVariance
// growthVariance
// headacheScore
// liquidityScore
// overallWeightedScore
module.exports = class Portfolio {
  constructor(investments, investmentTools) {
    this.investments = investments;
    this.investmentTools = investmentTools;
    this.generateName();
    this.calculateFeatures();
  }

  toPojo() {
    const {
      investmentsStr,
      annualIncome,
      annualGrowth,
      lowIncomeVarianceScore,
      lowGrowthVarianceScore,
      lowHeadacheScore,
      liquidityScore,
      std_score,
      scaled_score,
    } = this;

    return {
      investmentsStr,
      annualIncome,
      annualGrowth,
      lowIncomeVarianceScore,
      lowGrowthVarianceScore,
      lowHeadacheScore,
      liquidityScore,
      std_score,
      scaled_score,
    };
  }

  generateName() {
    this.investmentsStr = JSON.stringify(this.investments);
  }

  calculateFeatures(consumable) {
    this._calculateAnnualIncome(consumable);
    this._calculateAnnualGrowth(consumable);
    this._calculateLowGrowthVarianceScore(consumable);
    this._calculateLowIncomeVarianceScore(consumable);
    this._calculateLowHeadacheScore(consumable);
    this._calculateLiquidityScore(consumable);
  }
  
  _calculateAnnualIncome(consumable) {
    let sum = 0;
    const investmentTools = Object.keys(this.investments);
    investmentTools.forEach((investmentToolName) => {
      const investmentTool = this.investmentTools[investmentToolName];
      sum += (investmentTool.annualIncome * this.investments[investmentToolName]);
    });
    this.annualIncome = consumable ? sum.toFixed(4) : sum;
  }

  _calculateAnnualGrowth(consumable) {
    let sum = 0;
    const investmentTools = Object.keys(this.investments);
    investmentTools.forEach((investmentToolName) => {
      const investmentTool = this.investmentTools[investmentToolName];
      sum += this.investments[investmentToolName] * Math.pow(1 + investmentTool.annualGrowth, TIME_HORIZON_YEARS);
    });
    this.annualGrowth = consumable ? (Math.pow(sum, 1/TIME_HORIZON_YEARS) - 1).toFixed(4) : (Math.pow(sum, 1/TIME_HORIZON_YEARS) - 1);
  }

  _calculateLowIncomeVarianceScore(consumable) {
    let sum = 0;
    const investmentTools = Object.keys(this.investments);
    investmentTools.forEach((investmentToolName) => {
      const investmentTool = this.investmentTools[investmentToolName];
      sum += investmentTool.lowIncomeVarianceScore * this.investments[investmentToolName];
    });
    this.lowIncomeVarianceScore = consumable ? sum.toFixed(4) : sum;
  }
  
  _calculateLowGrowthVarianceScore(consumable) {
    let sum = 0;
    const investmentTools = Object.keys(this.investments);
    investmentTools.forEach((investmentToolName) => {
      const investmentTool = this.investmentTools[investmentToolName];
      sum += investmentTool.lowGrowthVarianceScore * this.investments[investmentToolName];
    });
    this.lowGrowthVarianceScore = consumable ? sum.toFixed(4) : sum;
  }
  
  _calculateLowHeadacheScore(consumable) {
    let score = 0;
    const investmentTools = Object.keys(this.investments);
    investmentTools.forEach((investmentToolName) => {
      const investmentTool = this.investmentTools[investmentToolName];
      score += investmentTool.lowHeadacheScore * this.investments[investmentToolName];
    });
    this.lowHeadacheScore = consumable ? score.toFixed(4) : score;
  }

  _calculateLiquidityScore(consumable) {
    let sum = 0;
    const investmentTools = Object.keys(this.investments);
    investmentTools.forEach((investmentToolName) => {
      const investmentTool = this.investmentTools[investmentToolName];
      sum += investmentTool.liquidityScore * this.investments[investmentToolName];
    });
    this.liquidityScore = consumable ? sum.toFixed(4) : sum;
  }

  _calculateOverallScore() {
    // this.overallScore = (0.6* this.annualIncome * 100 + 0.4 * this.annualGrowth * 100).toFixed(4);
    return (0.35* this.annualIncome + 0.1 * this.annualGrowth + 0.3 * this.lowIncomeVarianceScore + 0.0 * this.lowGrowthVarianceScore + 0.10 * this.liquidityScore + 0.15 * this.lowHeadacheScore);
  }
};
