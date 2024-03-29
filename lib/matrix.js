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

    if (isNaN(a) || Number.isFinite(a) == false ){
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

function getLeontiefInvType2(transaction, inputoutput, income_employment, householdConsumption) {
  /**
   * get leontief inverse matrix type 2
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector     
   *      income_employment => type: array 1d
   *      householdConsumption => type: array 1d
   * 
   * return => type: array of array
   */
  
  const directRequirement = getDirectReqMatrix(transaction, inputoutput, income_employment, householdConsumption)
  const identity = mathjs.identity(mathjs.size(directRequirement))
  const temp = mathjs.subtract(identity, directRequirement)
  return mathjs.inv(temp)
}


// =============================================== MULTIPLIER ================================================

// =============================================== Output Multiplier ================================================
function getOutputMultiplierType1(transaction, inputoutput) {
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

function getOutputMultiplierType2(transaction, inputoutput, income_employment, householdConsumption) {
    
  let outputMult = mathjs.zeros(mathjs.size(inputoutput))
  const leontiefInv = getLeontiefInvType2(transaction, inputoutput, income_employment, householdConsumption)
  const numrow = mathjs.size(transaction)[0],
    numcol = mathjs.size(transaction)[1];

  for (let j = 0; j < numcol; j++){
    let Oj = 0;

    for (let i = 0; i < (numrow + 1); i++) {
      Oj += leontiefInv[i][j];
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

function getIncomeMultiplierType2(transaction, inputoutput, income_employment, householdConsumption) {
  /**
   * get income multiplier type 2
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector     
   *      income_employment => type: array 1d
   *      householdConsumotion => type: array 1d
   * 
   * return => type: array 1d
   */
  const leontiefInv = getLeontiefInvType2(transaction, inputoutput, income_employment, householdConsumption)
  const numrow = mathjs.size(transaction)[0]
  const numcol = mathjs.size(transaction)[1]

  const selectedData = mathjs.zeros(numrow, numcol)._data

  // select necessary data in leontiefInvType2
  for (let i = 0; i < numrow; i++) {
    
    for (let j = 0; j < numcol; j++) {
      selectedData[i][j] = leontiefInv[i][j]
    }
  }
  let incomeCoef = mathjs.zeros(mathjs.size(income_employment))

  for (let i = 0; i < numrow; i++) {
    a = income_employment[i]/inputoutput[i]
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
function getEmploymentMultiplierType1(transaction, inputoutput, employment) {
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

function getEmploymentMultiplierType2(transaction, inputoutput, employment, householdConsumption) {
  /**
   * get employment multiplier type 2
   *
   * Args:
   *      transaction =>  type: array | transaction matrix
   *      inputoutput => type: array | ouput vector     
   *      employment => type: array 1d
   *      householdConsumotion => type: array 1d
   * 
   * return => type: array 1d
   */
  const leontiefInvType2 = getLeontiefInvType2(transaction, inputoutput, employment, householdConsumption)
  const numrow = mathjs.size(transaction)[0]
  const numcol = mathjs.size(transaction)[1]

  const selectedData = mathjs.zeros(numrow, numcol)._data

  // select necessary data in leontiefInvType2
  for (let i = 0; i < numrow; i++) {
    
    for (let j = 0; j < numcol; j++) {
      selectedData[i][j] = leontiefInvType2[i][j]
    }
  }
  let employmentCoef = mathjs.zeros(mathjs.size(employment))

  for (let i = 0; i < numrow; i++) {
    a = employment[i]/inputoutput[i]
    if (isNaN(a)){
      employmentCoef[i] = 0
    }else{
      employmentCoef[i] = a
    }
  }

  const employmentMult = mathjs.multiply(employmentCoef, selectedData)

  for (let i = 0; i < numrow; i++) {
    a = employmentMult[i]/employmentCoef[i]
    if (isNaN(a)){
      employmentMult[i] = 0
    }else{
      employmentMult[i] = a
    }
    
  }
  return employmentMult
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


// ======================================= Decomposition Analysis ========================================

function getDecomposition1(transaction2, inputoutput2, finalDemand1, finalDemand2) {
  const leontiefInv2 = getLeontiefInv(transaction2, inputoutput2)
  const finalDemandChange = mathjs.subtract(finalDemand1, finalDemand2)
  return mathjs.multiply(leontiefInv2, finalDemandChange)._data
}

function getDecomposition2(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand2) {
  const leontiefInv1 = getLeontiefInv(transaction1, inputoutput1)
  const leontiefInv2 = getLeontiefInv(transaction2, inputoutput2)
  const leontiefInvChange = mathjs.subtract(leontiefInv1, leontiefInv2)
  return mathjs.multiply(leontiefInvChange, finalDemand2)._data
}

function getDecomposition3(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand1, finalDemand2) {
  const leontiefInv1 = getLeontiefInv(transaction1, inputoutput1)
  const leontiefInv2 = getLeontiefInv(transaction2, inputoutput2)
  const leontiefInvChange = mathjs.subtract(leontiefInv1, leontiefInv2)
  const finalDemandChange = mathjs.subtract(finalDemand1, finalDemand2)
  return mathjs.multiply(leontiefInvChange, finalDemandChange)._data
}

function getSelfDecomposition1(transaction2, inputoutput2, finalDemand1, finalDemand2 ) {
  const leontiefInv2 = getLeontiefInv(transaction2, inputoutput2)
  const diagLeontiefInv2 = mathjs.diag(leontiefInv2)._data
  const finalDemandChange = mathjs.subtract(finalDemand1, finalDemand2)
  
  const res = []
  
  for (let i = 0; i < finalDemandChange.length; i++) {
      res.push(finalDemandChange[i]*diagLeontiefInv2[i])
  }
  return res
}

function getSelfDecomposition2(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand2 ) {
  const leontiefInv1 = getLeontiefInv(transaction1, inputoutput1)
  const leontiefInv2 = getLeontiefInv(transaction2, inputoutput2)
  const leontiefInvChange = mathjs.subtract(leontiefInv1, leontiefInv2)
  const diagleontiefInvChange = mathjs.diag(leontiefInvChange)._data

  const res = []
  for (let i = 0; i < finalDemand2.length; i++) {    
      res.push(finalDemand2[i]*diagleontiefInvChange[i])
  }
  return res
}

function getSelfDecomposition3(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand1, finalDemand2 ) {
  const leontiefInv1 = getLeontiefInv(transaction1, inputoutput1)
  const leontiefInv2 = getLeontiefInv(transaction2, inputoutput2)
  const leontiefInvChange = mathjs.subtract(leontiefInv1, leontiefInv2)
  const diagleontiefInvChange = mathjs.diag(leontiefInvChange)._data
  const finalDemandChange = mathjs.subtract(finalDemand1, finalDemand2)
  
  const res = []
  for (let i = 0; i < finalDemandChange.length; i++) {
      res.push(diagleontiefInvChange[i]*finalDemandChange[i])
  }
  return res
}

function getNonSelfDecomposition1(transaction2, inputoutput2, finalDemand1, finalDemand2) {
  const decomposition1 = getDecomposition1(transaction2, inputoutput2, finalDemand1, finalDemand2)
  const selfDecomposition1 = getSelfDecomposition1(transaction2, inputoutput2, finalDemand1, finalDemand2)
  return mathjs.subtract(decomposition1, selfDecomposition1)
}

function getNonSelfDecomposition2(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand2) {
  const decomposition2 = getDecomposition2(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand2)
  const selfDecomposition2 = getSelfDecomposition2(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand2)
  return mathjs.subtract(decomposition2, selfDecomposition2)
}

function getNonSelfDecomposition3(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand1, finalDemand2) {
  const decomposition3 = getDecomposition3(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand1, finalDemand2)
  const selfDecomposition3 = getSelfDecomposition3(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand1, finalDemand2)
  
  return mathjs.subtract(decomposition3, selfDecomposition3)
}

function getDecompositionAnalysis(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand1, finalDemand2) {
  /* get decomposition output from the given 2 data
  Args:
      transaction1: type => array 2d
      transaction2: type => array 2d
      inputoutput1: type => array 1d
      inputoutput2: type => array 1d
      finalDemand1: type => array 1d
      finalDemand2: type => array 1d
  return => type: array of object
  */
  const decomposition1 = getDecomposition1(transaction2, inputoutput2, finalDemand1, finalDemand2)
  const decomposition2 = getDecomposition2(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand2)
  const decomposition3 = getDecomposition3(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand1, finalDemand2)
  const selfDecomposition1 = getSelfDecomposition1(transaction2, inputoutput2, finalDemand1, finalDemand2)
  const selfDecomposition2 = getSelfDecomposition2(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand2 )
  const selfDecomposition3 = getSelfDecomposition3(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand1, finalDemand2)
  const nonSelfDecomposition1 = getNonSelfDecomposition1(transaction2, inputoutput2, finalDemand1, finalDemand2) 
  const nonSelfDecomposition2 = getNonSelfDecomposition2(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand2)
  const nonSelfDecomposition3 = getNonSelfDecomposition3(transaction1, transaction2, inputoutput1, inputoutput2, finalDemand1, finalDemand2)

  const res = []
  for (let i = 0; i < decomposition1.length; i++) {
      res.push({
          "decomposition 1": decomposition1[i], 
          "decomposition 2": decomposition2[i],
          "decomposition 3": decomposition3[i],
          "self decomposition 1": selfDecomposition1[i],
          "self decomposition 2": selfDecomposition2[i],
          "self decomposition 3": selfDecomposition3[i],
          "non self decomposition 1": nonSelfDecomposition1[i],
          "non self decomposition 2": nonSelfDecomposition2[i],
          "non self decomposition 3": nonSelfDecomposition3[i],
      })
  }
  return res
}

function getMPM_benchmark(transaction, inputoutput) {
  const leontiefInv = getLeontiefInv(transaction, inputoutput)._data;
  const numrow = mathjs.size(transaction)[0], numcol = mathjs.size(transaction)[1]
  const Li = []
  const Lj = []
  const result = {}
  // sum each row leontief inverse
  for (let i = 0; i < numrow; i++) {
      let aa = 0    
      for (let j = 0; j < numcol; j++) {
          aa += leontiefInv[i][j]
      }
      Li[i] = aa
  }
  // sum each col leontief inverse
  leontiefInv.forEach(sub => {
      sub.forEach((num, index) => {
          if (Lj[index]){
              Lj[index] += num;
          }else{
              Lj[index] = num;
          }
      })
  }) 
  const Li_obj = Object.assign({}, Li)
  const Lj_obj = Object.assign({}, Lj)
  const Li_objSorted = Object.entries(Li_obj).sort((a, b) => b[1]-a[1])
  const Lj_objSorted = Object.entries(Lj_obj).sort((a, b) => b[1]-a[1])
  const indexLiSorted = []
  const indexLjSorted = []
  const Li_sorted = mathjs.reshape(Li.sort(function(a, b){return b-a}), [Li.length, 1])
  const Lj_sorted = mathjs.reshape(Lj.sort(function(a, b){return b-a}), [Lj.length, 1])
  
  for (let i = 0; i < Li_objSorted.length; i++) {
      indexLiSorted.push(parseInt(Li_objSorted[i][0]))
  }
  for (let i = 0; i < Lj_objSorted.length; i++) {
      indexLjSorted.push(parseInt(Lj_objSorted[i][0]))
  }

  let m_ordered = mathjs.multiply(Li_sorted, mathjs.transpose(Lj_sorted))
  const V = mathjs.sum(leontiefInv);
  
  for (let i = 0; i < numrow; i++) {
      for (let j = 0; j < numcol; j++) {
          m_ordered[i][j] = m_ordered[i][j]/V
      }
  }
  result['ordered'] = m_ordered
  result['indexLiOrdered'] = indexLiSorted; result['indexLjOrdered'] = indexLjSorted
  return result
}

function getMPM_t(transaction, inputoutput, benchmarkData) {
  const leontiefInv = getLeontiefInv(transaction, inputoutput)._data;
  const numrow = mathjs.size(transaction)[0], numcol = mathjs.size(transaction)[1]
  const Li = []
  const Lj = []
  const result = {}
  // sum each row leontief inverse
  for (let i = 0; i < numrow; i++) { 
      let aa = 0    
      for (let j = 0; j < numcol; j++) {
          aa += leontiefInv[i][j]
      }
      Li[i] = aa
  }
  // sum each col leontief inverse
  leontiefInv.forEach(sub => {
      sub.forEach((num, index) => {
          if (Lj[index]){
              Lj[index] += num;
          }else{
              Lj[index] = num;
          }
      })
  })
  // ============= sorted Li and Lj based on benchmarkData index =============
  const indexLiOrdered = benchmarkData.indexLiOrdered
  const indexLjOrdered = benchmarkData.indexLjOrdered
  const Li_sorted = mathjs.reshape(indexLiOrdered.map(i => Li[i]), [Li.length, 1])
  const Lj_sorted = mathjs.reshape(indexLjOrdered.map(i => Lj[i]), [Lj.length, 1]) 

  let m_ordered = mathjs.multiply(Li_sorted, mathjs.transpose(Lj_sorted))
  const V = mathjs.sum(leontiefInv);

  // ============= descending Li and Lj =============
  const Li_obj = Object.assign({}, Li)
  const Lj_obj = Object.assign({}, Lj)
  const Li_objDesc = Object.entries(Li_obj).sort((a, b) => b[1]-a[1])
  const Lj_objDesc = Object.entries(Lj_obj).sort((a, b) => b[1]-a[1])
  // getting descending index
  const indexLiDesc = []
  const indexLjDesc = []
  for (let i = 0; i < Li_objDesc.length; i++) {
      indexLiDesc.push(parseInt(Li_objDesc[i][0]))
  }
  for (let i = 0; i < Lj_objDesc.length; i++) {
      indexLjDesc.push(parseInt(Lj_objDesc[i][0]))
  }
  // Li and Lj descending way
  const Li_desc = mathjs.reshape(Li.sort(function(a, b){return b-a}), [Li.length, 1])
  const Lj_desc = mathjs.reshape(Lj.sort(function(a, b){return b-a}), [Lj.length, 1])
  let m_desc = mathjs.multiply(Li_desc, mathjs.transpose(Lj_desc))
  
  // return m_ordered
  for (let i = 0; i < numrow; i++) {
      for (let j = 0; j < numcol; j++) {
          m_desc[i][j] = m_desc[i][j]/V
          m_ordered[i][j] = m_ordered[i][j]/V
      }
  }

  result['descending'] = m_desc; result['ordered'] = m_ordered
  result['indexLiDescending'] = indexLiDesc; result['indexLjDescending'] = indexLjDesc;
  result['indexLiOrdered'] = indexLiOrdered; result['indexLjOrdered'] = indexLjOrdered
  
  return result
}

// ============================================ Extraction Method ==================================================
function arrangeBackForward(region, backforward) {
  const backforwardRes = mathjs.zeros(backforward.length)._data

  for (let i = 0; i < backforward.length; i++) {
      if (i == 0) {
          backforwardRes[i] = backforward[region-1]
          continue
      }
      if (i > (region-1)){
          backforwardRes[i] = backforward[i]
          continue
      }
      backforwardRes[i] = backforward[i-1]    
  }
  return backforwardRes
}

function getExtractionBackward(region, transaction, inputoutput, finalDemand){
  const leontiefInverse = getLeontiefInv(transaction, inputoutput)
  const allocation = getAllocationMatrix(transaction, inputoutput)
  const numrow = mathjs.size(allocation)[0]; 
  const numcol = mathjs.size(allocation)[1]
  const identity = mathjs.identity(numcol)
  const ia = mathjs.subtract(identity, allocation)._data

  for (let i = 0; i < numrow; i++) {   
      for (let j = 0; j < numcol; j++) {
          if (i == (region-1) && j == (region-1)) {
              ia[i][j] = ia[i][j]
          }
          else if (i == (region-1) || j == (region-1)){
              ia[i][j] = 0
          }
          else{
              ia[i][j] = ia[i][j]
          }
      }
  }
  const iaInverse = mathjs.inv(ia)

  const lia = mathjs.subtract(leontiefInverse, iaInverse)
  const res = mathjs.multiply(lia, finalDemand)

  return res._data
}

function getExtractionForward(region, transaction, inputoutput, inputPrimer) {
  const ghoshianInverse = getGhoshianInv(transaction, inputoutput)
  const transactionTranspose = mathjs.transpose(transaction)
  const allocation = getAllocationMatrix(transactionTranspose, inputoutput)
  const numrow = mathjs.size(allocation)[0]; 
  const numcol = mathjs.size(allocation)[1]
  const identity = mathjs.identity(numcol)
  const ib = mathjs.subtract(identity, allocation)._data

  for (let i = 0; i < numrow; i++) {   
      for (let j = 0; j < numcol; j++) {
          if (i == (region-1) && j == (region-1)) {
              ib[i][j] = ib[i][j]
          }
          else if (i == (region-1) || j == (region-1)){
              ib[i][j] = 0
          }
          else{
              ib[i][j] = ib[i][j]
          }
      }
  }
  const ibInv = mathjs.inv(ib)   
  const lib = mathjs.subtract(ghoshianInverse, ibInv)
  // const res = mathjs.multiply(inputPrimer, lib)
  const res = mathjs.multiply(lib, inputPrimer)

  return res._data
}

function getExtraction(region, transaction, inputoutput, finalDemand, inputPrimer) {
  const backward = getExtractionBackward(region, transaction, inputoutput, finalDemand);
  const forward = getExtractionForward(region, transaction, inputoutput, inputPrimer);
  
  const backwardArranged = arrangeBackForward(region, backward)
  const forwardArranged = arrangeBackForward(region, forward)

  return {
      "backward": backwardArranged,
      "forward": forwardArranged
  }
}



module.exports = {
  getAllocationMatrix,
  getOutputImpact,
  getLeontiefInv,
  getGhoshianInv,
  getPrimaryInputImpact,
  getOutputMultiplierType1,
  getOutputMultiplierType2,
  getIncomeMultiplierType1,
  getIncomeMultiplierType2,
  getEmploymentMultiplierType1,
  getEmploymentMultiplierType2,
  getInputOrSupplyMultiplier,
  getKeySector,
  getTotalFinalDemand,
  getFieldInfluence,
  getDirectReqMatrix,
  getDecompositionAnalysis,
  getMPM_benchmark,
  getMPM_t,
  getExtraction
};