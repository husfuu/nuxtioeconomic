const { index } = require("mathjs");
const mathjs = require("mathjs");

// data collection
function getTotalFinalDemand(data) {
  /* get the total demand
  Args:
    data: type => matrix
  
  return => type: array 1d | vector
  */
  const numcol = mathjs.size(data)[0]
  const numrow = mathjs.size(data)[1]

  const total = []
  for (let i = 0; i < numcol; i++) {
    let a_i = 0;
    
    for (let j = 0; j < numrow; j++){
       a_i += data[i][j]
    }
    total.push(a_i)
  }
  return total
}

// ======================================== BASIC I-O Analysis ======================================== 
function getAllocationMatrix(transaction, inputoutput) {
  /**
   * get Allocation matrix
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *
   * return => type: Matrix mathjs obj
   */
  let indexRow = 0,
    indexCol = 0;
  const numrow = mathjs.size(transaction)[0],
    numcol = mathjs.size(transaction[1]);

  // const numrow = mathjs.size(transaction)[0] , numcol = mathjs.size(transaction[1]);
  let allocation = mathjs.zeros(mathjs.size(transaction));
  while (true) {
    let t_ij = mathjs.column(transaction, indexCol)[indexRow]; // transaction item in i, j index
    let o_j = inputoutput[indexCol]; // inputoutput item in j index
    let a = t_ij / o_j; // allocation coefficient

    if (isNaN(a)){
      allocation[indexRow][indexCol] = 0;
    }else{
      allocation[indexRow][indexCol] = a;
    }
    if (indexRow == numrow - 1) {
      indexRow = 0;
      indexCol += 1;
    } else {
      indexRow += 1;
    }
    if (indexCol == numcol) {
      break;
    }
  }
  return allocation
}

function getLeontiefInv(transaction, inputoutput) {
  /**
   * get leontief inverse matrix
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *
   * return => type: Matrix mathjs obj
   */
  const numcol = mathjs.size(transaction)[1];
  const identity = mathjs.identity(numcol); // size is (numrow, numcol)
  const allocation = getAllocationMatrix(transaction, inputoutput);
  const temp = mathjs.subtract(identity, allocation);
  const leontiefInv = mathjs.inv(temp);

  return leontiefInv;
}

function getGhoshianInv(transaction, inputoutput) {
  /**
   * get ghoshian inverse matrix
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *
   * return => type: Matrix mathjs obj
   */
  const numcol = mathjs.size(transaction)[1];
  const identity = mathjs.identity(numcol); // size is (numrow, numcol)
  const transactionTranspose = mathjs.transpose(transaction);
  const allocation = getAllocationMatrix(transactionTranspose, inputoutput);

  const temp = mathjs.subtract(identity, allocation);
  const ghoshianInv = mathjs.inv(temp);

  return ghoshianInv;
}


function getSumVector(data) {
  /**
   * get sum of all items in data vector
   *
   * Args:
   *   data: => array 1d | vector   
   * 
   * return => type: number
   */
  let sumResult = 0
  for (let i = 0; i < data.length; i++) {
    sumResult += data[i]
  }
  return sumResult
}

function getDirectReqMatrix(transaction, inputoutput, income, householdConsumption) {
  /**
   * get direct requirement matrix
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array 1d | ouput vector
   *      income => type: array 1d
   *      householdConsumotion => type: array 1d
   * return => type: array of array
   */
  const allocation = getAllocationMatrix(transaction, inputoutput)
  const numrow = mathjs.size(transaction)[0] + 1
  const numcol = mathjs.size(transaction)[1] + 1
  const sumIncome = getSumVector(income)
  const result = mathjs.zeros(numrow, numcol)._data

  for (let i = 0; i < numrow; i++) {
    for (let j = 0; j < numcol; j++) {

      if (i == numrow-1) {
        a = income[j]/inputoutput[j]
        if (isNaN(a)){
          result[i][j] = 0
        }else{
          result[i][j] = a
        }
        if (j == numcol-1){
          result[i][j] = 0
          return result
        }
        continue;
      }
      if (j == numcol-1) {
        result[i][j] = householdConsumption[i]/sumIncome
      }else{
        result[i][j] = allocation[i][j]
      }
    }
  }
}


function getLeontiefInvType2(transaction, inputoutput, income, householdConsumption) {
  /**
   * get leontief inverse matrix type 2
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector     
   *      income => type: array 1d
   *      householdConsumotion => type: array 1d
   * 
   * return => type: array of array
   */
  const directRequirement = getDirectReqMatrix(transaction, inputoutput, income, householdConsumption)
  const identity = mathjs.identity(mathjs.size(directRequirement))
  const temp = mathjs.subtract(identity, directRequirement)

  return mathjs.inv(temp)
}


// =============================================== MULTIPLIER ================================================
function getOutputMultiplier(transaction, inputoutput) {
  /**
   * get output multiplier
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *
   * return => type: Matrix mathjs obj | output multiplier vector
   */

  let outputMult = mathjs.zeros(mathjs.size(inputoutput));
  const leontiefInv = getLeontiefInv(transaction, inputoutput);
  const numrow = mathjs.size(transaction)[0],
    numcol = mathjs.size(transaction)[1];

  for (let j = 0; j < numcol; j++) {
    let Oj = 0;
    for (let i = 0; i < numrow; i++) {
      Oj += leontiefInv.subset(mathjs.index(i, j));
    }
    outputMult[j] = [Oj];
  }
  return outputMult;
}

// =================================== Income Multiplier ====================================
function getIncomeMultiplierType1(transaction, inputoutput, income) {
  /**
   * get income multiplier type 1
   *
   * Args:
   *      transaction => type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *      income => type: array | income vector
   *
   * return => type: Matrix mathjs obj | income multiplier vector
   */
  const leontiefInv = getLeontiefInv(transaction, inputoutput);

  const incomeCoef = mathjs.zeros(mathjs.size(income));
  let a;
  for (let i = 0; i < income.length; i++) {
    a = income[i] / inputoutput[i];
    if (isNaN(a)) {
      a = 0
    }
    incomeCoef[i] = a;
  }
  let result = mathjs.multiply(incomeCoef, leontiefInv)._data;

  for (let i = 0; i < mathjs.size(incomeCoef)[0]; i++) {
    
    a = result[i]/incomeCoef[i]
    if (isNaN(a)){
      result[i] = 0
    }else{
      result[i] = a
    }
  }
  return result
}

function getIncomeMultiplierType2(transaction, inputoutput, income, householdConsumption) {
  /**
   * get income multiplier type 2
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector     
   *      income => type: array 1d
   *      householdConsumotion => type: array 1d
   * 
   * return => type: array 1d
   */
  const leontiefInvType2 = getLeontiefInvType2(transaction, inputoutput, income, householdConsumption)
  const numrow = mathjs.size(transaction)[0]
  const numcol = mathjs.size(transaction)[1]

  const selectedData = mathjs.zeros(numrow, numcol)._data

  // select necessary data in leontiefInvType2
  for (let i = 0; i < numrow; i++) {
    
    for (let j = 0; j < numcol; j++) {
      selectedData[i][j] = leontiefInvType2[i][j]
    }
  }
  let incomeCoef = mathjs.zeros(mathjs.size(income))

  for (let i = 0; i < numrow; i++) {
    a = income[i]/inputoutput[i]
    if (isNaN(a)){
      incomeCoef[i] = 0
    }else{
      incomeCoef[i] = a
    }
  }

  const incomeMult = mathjs.multiply(incomeCoef, selectedData)

  for (let i = 0; i < numrow; i++) {
    a = incomeMult[i]/incomeCoef[i]
    if (isNaN(a)){
      incomeMult[i] = 0
    }else{
      incomeMult[i] = a
    }
    
  }
  return incomeMult
}

// =================================== Employment Multiplier ====================================
function getEmploymentMultiplier(transaction, inputoutput, employment) {
  /**
   * get employment multiplier
   *
   * Args:
   *      transaction => type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *      employment => type: array | employment
   *
   * return => type: array | employment multiplier vector
   */

  const leontiefInv = getLeontiefInv(transaction, inputoutput);

  const employmentMult = mathjs.zeros(mathjs.size(employment));
  let w;
  for (let i = 0; i < employment.length; i++) {
    w = employment[i] / inputoutput[i];
    if (isNaN(w)){
      w = 0
    }
    employmentMult[i] = w;
  }
  let result = mathjs.multiply(employmentMult, leontiefInv)._data;
  let matrix = [];
  for (let i = 0; i < result.length; i++) {
    matrix.push([result[i]]);
  }
  return matrix;
}


// =================================== InputSupply Multiplier ====================================
function getInputOrSupplyMultiplier(transaction, inputoutput) {
  /**
   * get supply (input) multiplier
   *
   * Args:
   *      transaction => type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *
   * return => type: Matrix mathjs obj| supply multiplier vector
   */

  const ghoshianInv = getGhoshianInv(transaction, inputoutput);

  let supplyMult = mathjs.zeros(mathjs.size(inputoutput));
  const numrow = mathjs.size(transaction)[0],
    numcol = mathjs.size(transaction)[1];

  for (let j = 0; j < numcol; j++) {
    let Oj = 0;
    for (let i = 0; i < numrow; i++) {
      Oj += ghoshianInv.subset(mathjs.index(i, j));
    }
    supplyMult[j] = [Oj];
  }
  return supplyMult;
}

// ========================================== IMPACT ANALYSIS ==========================================
function getCoefImpact(primaryInput, inputoutput){
  /* get coeficient matrix in ordering to analyze the impact of a primary input on final demand
  Args:
      primaryInput: type => vector 
  return => type: matrix | diagonal matrix whose size corresponds to the length of the vector
  */    
  let coef = mathjs.zeros(mathjs.size(primaryInput))
  for (let i = 0; i < primaryInput.length; i++) {
      a = primaryInput[i]/inputoutput[i]
      if (isNaN(a)) {
          a = 0
        }
      coef[i] = a
  }
  coef = mathjs.diag(coef)
  return coef
}

function getOutputImpact(transaction, inputoutput, finalDemand) {
  /* get output impact to analyze the impact of output on final demand
  Args:
      transaction: type => matrix 
      inputoutput: type => vector
      finalDemand: type => matrix 
  return => type: array | matrix that have same size with final demand
  */
  const leontiefInv = getLeontiefInv(transaction, inputoutput)
  return mathjs.multiply(leontiefInv, finalDemand)._data
}

function getPrimaryInputImpact(transaction, inputoutput, finalDemand, primaryInput){
    /* get output impact to analyze the impact of a primary input on final demand
    Args:
        transaction: type => matrix 
        inputoutput: type => vector
        finalDemand: type => matrix 
        primaryInput: type => vector | employment, income, tax, etc
    return => type: array | matrix that have same size with final demand
    */
  const leontiefInv = getLeontiefInv(transaction, inputoutput)
  const coef = getCoefImpact(primaryInput, inputoutput)

  if (leontiefInv._size[0] !== mathjs.size(finalDemand)[0]){
    return "cannot operate, because the size of the final demand does not meet the requirements"
  }

  const temp = mathjs.multiply(leontiefInv, finalDemand)
  return mathjs.multiply(coef, temp)._data
}



// ======================================== ADVANCE I-O Analysis ======================================== 
function getForwardLinkage(transaction, inputoutput, leontiefInv) {
  /* calc the ordered sector j's forward linkage (FLi)
   * Args: 
   *      transaction => type: array | transaction matrix
   *      inputoutput => type: array | inputouput vector
   *      leontiefInv => type: array
   * return => type: Matrix mathjs obj| supply multiplier vector     *
  */
  const numrow = mathjs.size(transaction)[0], numcol = mathjs.size(transaction)[1]
  
  const FL = mathjs.zeros(mathjs.size(inputoutput))
  for (let j = 0; j < numcol; j++) {
      
      let fLj = 0
      for (let i = 0; i < numrow; i++) {
          fLj += leontiefInv.subset(mathjs.index(i, j));
      }
      FL[j] = fLj
  }
  const V = mathjs.sum(leontiefInv)
  
  const forwardLinkage = mathjs.divide(FL, ((1/numcol)*V))
  const forwardLinkageObj = {}

  for (let i = 0; i < forwardLinkage.length; i++) {
      forwardLinkageObj[i] = forwardLinkage[i]
  }

  return Object.entries(forwardLinkageObj).sort((a, b) => b[1]-a[1])
}

function getBackwardLinkage(transaction, inputoutput, leontiefInv) {
  /* calc the ordered sector j's backward linkage (FLi) 
   * Args: 
   *      transaction => type: array | transaction matrix
   *      inputoutput => type: array | inputouput vector
   *      leontiefInv => type: array
   * return => type: Matrix mathjs obj| supply multiplier vector     *
  */
  const numrow = mathjs.size(transaction)[0], numcol = mathjs.size(transaction)[1];
  const BL = mathjs.zeros(mathjs.size(inputoutput));

  for (let i = 0; i < numrow; i++) {
      
      let bLi = 0
      for (let j = 0; j < numcol; j++) {
          bLi += leontiefInv.subset(mathjs.index(i, j));
      }
      BL[i] = bLi
  }
  const V = mathjs.sum(leontiefInv);
  
  const backwardLinkage = mathjs.divide(BL, ((1/numcol)*V))
  const backwardLinkageObj = {}

  for (let i = 0; i < backwardLinkage.length; i++) {
      backwardLinkageObj[i] = backwardLinkage[i]
  }

  return Object.entries(backwardLinkageObj).sort((a, b) => b[1]-a[1])
}

function getKeySector(transaction, inputoutput) {
  /* calc the ordered sector j's backward linkage (FLi) 
   * calc the ordered sector j's forward linkage (FLi)
   * Args: 
   *      transaction => type: array | transaction matrix
   *      inputoutput => type: array | inputouput vector
   * 
   * return => type: object of array
  */
  const leontiefInv = getLeontiefInv(transaction, inputoutput);
  console.log(leontiefInv)
  const backwardLinkage = getBackwardLinkage(transaction, inputoutput, leontiefInv);
  const forwardLinkage = getForwardLinkage(transaction, inputoutput, leontiefInv);

  const result = []

  for (let i = 0; i < inputoutput.length; i++) {
    result.push({"sectorforward": forwardLinkage[i][0], "valueforward": forwardLinkage[i][1], 
    "sectorbackward": backwardLinkage[i][0], "valuebackward": backwardLinkage[i][1]})
  }
  return result
}

function getFieldInfluence(transaction, inputoutput, rowIndex, colIndex) {
  /**
   * get field of influence
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector
   *      rowIndex => type: integer
   *      colIndex => type: integer
   * return => type: array
   */
    const leontiefInv = getLeontiefInv(transaction, inputoutput)._data
    const numrow = mathjs.size(leontiefInv)[0]
    const numcol = mathjs.size(leontiefInv)[1]
    // console.log(mathjs.size(leontiefInv._data)[0])
    let Li = [] // row
    let Lj = [] // column

    for (let i = 0; i < numrow; i++) {

        for (let j = 0; j < numcol; j++) {
            if (i == (colIndex-1)){
                Li.push(leontiefInv[i][j])
            }
            if (j == (rowIndex-1)){
                Lj.push(leontiefInv[i][j])
            }
        }
    }
    
    let result = mathjs.zeros(mathjs.size(leontiefInv))
    for (let i = 0; i < numrow; i++) {
        for (let j = 0; j < numcol; j++) {
            result[i][j] = Li[i]*Lj[j]
        }
    }
    return result
}




module.exports = {
  getAllocationMatrix,
  getOutputImpact,
  getLeontiefInv,
  getGhoshianInv,
  getPrimaryInputImpact,
  getOutputMultiplier,
  getIncomeMultiplierType1,
  getIncomeMultiplierType2,
  getEmploymentMultiplier,
  getInputOrSupplyMultiplier,
  getKeySector,
  getTotalFinalDemand,
  getFieldInfluence,
  getDirectReqMatrix
};