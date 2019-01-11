const fs = require('fs');

let cache = {};

const UTILS = {
  solveForMinAndMax(tools, A, B, length=0) {
    const cacheKey = `${JSON.stringify(tools)}|${A}|${B}|${length}`;

    if (cache[cacheKey]) {
      // console.log("cache used", cacheKey);
      return UTILS.clone(cache[cacheKey]);
    } 

    let ports = []
    if (A<=0 && B >= 0) {
      ports.push(Array(tools.length).fill(0))
    }
    
    if (B > 0 && length < 100) {
      if (tools.length > 1) {
        let subPorts1 = UTILS.solveForMinAndMax(tools.slice(1), A, B, length);
        subPorts1.forEach((p) => {
          p.unshift(0);
        });
        ports = ports.concat(subPorts1);
      }
      
      if (tools.length >= 1) {
        let toolsC = tools.slice();
        let subPorts2 = UTILS.solveForMinAndMax(toolsC, A - toolsC[0], B - toolsC[0], length+1);
        subPorts2.forEach((p) => {
          p[0] = p[0] + 1;
        });

        ports = ports.concat(subPorts2);
      }
    }

    cache[cacheKey] = UTILS.clone(ports);
    // console.log("caching", tools, A, B ports.length && ports[0].length)
    // console.log("cached", tools,A ,B cache[cacheKey].length && cache[cacheKey][0].length)

    return ports.slice();
  },
  dedupe(array) {
    const stringified = array.map((o) => JSON.stringify(o));
    const deduped = Array.from(new Set(stringified));

    return deduped.map((str) => JSON.parse(str));
  },
  clone(o) {
    return JSON.parse(JSON.stringify(o));
  },
  forceGC() {
    if (global.gc) {
      global.gc();
    }
  }
};

module.exports = class PortfolioGenerator {
  constructor(investmentTools, annualIncomeRange) {
    this.investmentTools = investmentTools;
    this.annualIncomeRange = annualIncomeRange;
  }

  generateAllPortfolios() {
    // find solutions for following 2 equations:
    // w1 * 0.087 + w2 * 0.09 + w3 * 0.05 = 0.06
    // w1 * 8.7 + w2 * 9 + w3 * 5 = 6
    // W1* 8.7 + W2 * 9 + W3 * 5 = 600
    // W1 + W2 + W3 + W4 < 100
    // sols(tools[N], A, B) = sols(tools[N-1], A, B, [0,..]) + sols(tools[N], A - tools[0], B - tools[0], [1, 0, 0])
    // separate zro and non-zero investments
    const zeroIncomeInvestments = Object.values(this.investmentTools)
        .filter((inv) => {
          return inv.annualIncome === 0
        })
        .map((inv) => inv.name);
    const nonZeroIncomeInvestments = Object.values(this.investmentTools)
        .filter((inv) => {
          return inv.annualIncome !== 0
        })
        .map((inv) => inv.name);
    const toolsAnnualIncomes = Object.values(this.investmentTools).map((o) => o.annualIncome*100);
    
    console.log("generating");
    let ports = UTILS.solveForMinAndMax(toolsAnnualIncomes.filter((o)=>!!o), parseInt(this.annualIncomeRange[0]*10000), parseInt(this.annualIncomeRange[1]*10000));
    
    console.log("filtering out weight-sum > 100", ports.length);
    ports = ports.filter((p) => {
      return p.reduce((sum, val) => sum+val) <= 100;
    });    

    console.log("filtering out scss > 17", ports.length);
    const scssIndex = nonZeroIncomeInvestments.indexOf('scss');
    ports = ports.filter((p) => {
      return p[scssIndex] <= this.investmentTools.scss.maxInvestment * 100;
    })
    
    let finalInvestments = [];

    console.log("expanding", ports.length);
    cache = {}
    ports.forEach((port, index) => {
      // for each portfolio
      if (index % 100000 == 0) {
        console.log(index + 1 + "/" +  ports.length);
        UTILS.forceGC();
      }
      
      // find the residual Weight
      const residualWeight = 100 - port.reduce((sum, inv) => sum + inv);
      
      // assign portfolio weights to non-zero investments
      const portfolioInvestment = {};
      nonZeroIncomeInvestments.forEach((inv, index) => {
        portfolioInvestment[inv] = port[index]/100;
      });
      
      // generate residual weights
      const residualWeights = UTILS.solveForMinAndMax(
        Array(zeroIncomeInvestments.length).fill(1),
        residualWeight,
        residualWeight
      );

      // iterate over residual weights
      residualWeights.forEach((wArr) => {
        // assign residual weights to zero invesments
        const residualInvestment = {};
        zeroIncomeInvestments.forEach((inv, index) => {
          residualInvestment[inv] = wArr[index]/100;
        });
        // merge with non-zero investment to produce full investment portfolio
        const fullInvestment = Object.assign({}, portfolioInvestment, residualInvestment);
        finalInvestments.push(fullInvestment);
      });
    });
    
    console.log("filtering");
    finalInvestments = this.filterForConstraints(finalInvestments);

    console.log("deduping");
    finalInvestments = UTILS.dedupe(finalInvestments);
    
    return finalInvestments;
  }

  filterForConstraints(investments) {
    return investments.filter((inv) => {
      return inv.scss <= this.investmentTools.scss.maxInvestment
    });
  }

  writeAllPortfolios() {
    const ports = this.generateAllPortfolios();
    
    console.log("writing");
    fs.writeFileSync(
      'public/raw-ports.json', 
      JSON.stringify({
        ports,
        variables: {
          investmentTools: this.investmentTools,
          annualIncomeRange: this.annualIncomeRange
        },
      })
    );

    console.log("total raw portfolios generated", ports.length);
  }
};