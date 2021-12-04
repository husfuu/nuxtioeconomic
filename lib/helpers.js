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

export const getTableData = (component) => {
  if (!component) {
    return;
  }
  let result = component.$children[0].__hotInstance.getSourceDataArray();
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

export const loadData = (component, data) => {
  if (!component || !data) {
    return;
  }
  component.$children[0].__hotInstance.loadData(data);
};
