export const downloadCSV = (component) => {
  if (!component) {
    return;
  }
  const exportPlugin1 = component.current.hotInstance.getPlugin("exportFile");
  exportPlugin1.downloadFile("csv", {
    bom: false,
    columnDelimiter: ",",
    columnHeaders: false,
    exportHiddenColumns: false,
    exportHiddenRows: false,
    fileExtension: "csv",
    filename: "IOEconomic-file_[YYYY]-[MM]-[DD]",
    mimeType: "text/csv",
    rowDelimiter: "\r\n",
    rowHeaders: false,
  });
};

export const refreshSize = (component) => {
  if (!component) {
    return;
  }
  component.$children[0].__hotInstance.render();
};

export const clearTable = (component) => {
  if (!component) {
    return;
  }
  component.$children[0].__hotInstance.clear();
};

export const getTableData = (component) => {
  if (!component) {
    return;
  }
  let result = component.$children[0].__hotInstance.getSourceDataArray();
  return result;
};

export const getIncome = (incometable) => {
  if (!incometable) {
    return;
  }
  let result = incometable.reduce((arrays, array) =>
    arrays.map((total, index) => total + array[index])
  );
  return result;
};

export const findTable = (component, table) => {
  if (!component) {
    return;
  }

  return component.$parent.$children.filter((component) => {
    return component.$options._componentTag == table;
  })[0];
};

export const findTableinLayout = (component, table) => {
  if (!component) {
    return;
  }

  return component.$children.filter((component) => {
    return component.$options._componentTag == table;
  })[0];
};

export const updatePattern = (component, pattern) => {
  if (!component) {
    return;
  }
  component.$children[0].__hotInstance.updateSettings({
    numericFormat: {
      pattern: pattern,
    },
  });
};

export const loadData = (component, data) => {
  if (!component || !data) {
    return;
  }
  component.$children[0].__hotInstance.loadData(data);
};

export const toNumber = (string) => {
  if (!string || typeof string == "number") {
    return;
  }
  return Number(string.replace(/,/g, ""));
};

export const numberValidation = (arrayofarray) => {
  if (!arrayofarray) {
    return;
  }

  for (let row = 0; row < arrayofarray.length; row++) {
    for (let col = 0; col < arrayofarray[0].length; col++) {
      arrayofarray[row][col] = toNumber(arrayofarray[row][col]);
    }
  }
  return arrayofarray;
};
