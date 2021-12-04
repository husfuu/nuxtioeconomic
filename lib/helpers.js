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

export const getTableData = (component, index) => {
  if (!component) {
    return;
  }
  component = component.$parent.$children[index];
  let result = component.$children[0].__hotInstance.getSourceDataArray();
  return result;
};

export const csvToArray = (file, delimiter = ",") => {
  if (!file) {
    return;
  }
  return array;
};

export const loadData = (component, index, data) => {
  if (!component || !data) {
    return;
  }
  component = component.$parent.$children[index];
  component.$children[0].__hotInstance.loadData(data);
};
