<template>
  <div>
    <hot-table :settings="hotSettings"/>
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import { ContextMenu } from "handsontable/plugins/contextMenu";

import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.css";

const tableset = require("../../data/tableset.json")
export default {
  components: {
    HotTable,
    
  },
  data() {
    return {
      hotSettings: {
        data: Handsontable.helper.createSpreadsheetData(6, 10),
        ...tableset,
        contextMenu: {
      items: {
        refresh: {
          name: "Resize columns",
          callback: () => {
            refreshSize(transactionTable);
          },
        },
        row_above: {},
        row_below: {},

        col_left: {},
        col_right: {},

        remove_row: {},
        remove_col: {},

        alignment: {},
        separator1: ContextMenu.SEPARATOR,
        basic: {
          name: "Basic IO Analysis",
          submenu: {
            items: [
              {
                key: "basic:01",
                name: "Leontief Inverse",
                callback: () => {
                  let transaction = getTableData(transactionTable);
                  let inputoutput = getTableData(inputOutputTable)[0];
                  let result = getLeontiefInv(transaction, inputoutput)._data;
                  loadData(resultTable, result);
                },
              },
              {
                key: "basic:02",
                name: "Ghosian Inverse",
                callback: () => {
                  let transaction = getTableData(transactionTable);
                  let inputoutput = getTableData(inputOutputTable)[0];
                  let result = getGhoshianInv(transaction, inputoutput)._data;
                  loadData(resultTable, result);
                },
              },
              {
                key: "basic:03",
                name: "Impact Analysis",
                callback: () => {
                  let transaction = getTableData(transactionTable);
                  let inputoutput = getTableData(inputOutputTable)[0];
                  let screnario = getTableData(screnarioTable);
                  let result = getImpactAnalysis(
                    transaction,
                    inputoutput,
                    screnario
                  );
                  loadData(resultTable, result);
                },
              },
              {
                key: "basic:04",
                name: "Output Multiplier",
                callback: () => {
                  let transaction = getTableData(transactionTable);
                  let inputoutput = getTableData(inputOutputTable)[0];
                  let result = getOutputMultiplier(transaction, inputoutput);
                  loadData(resultTable, result);
                },
              },
              {
                key: "basic:05",
                name: "Income Multiplier",
                callback: () => {
                  let transaction = getTableData(transactionTable);
                  let inputoutput = getTableData(inputOutputTable)[0];
                  let income = getTableData(incomeTable)[0];
                  let result = getIncomeMultiplier(
                    transaction,
                    inputoutput,
                    income
                  );
                  loadData(resultTable, result);
                },
              },
              {
                key: "basic:06",
                name: "Employment Multiplier",
                callback: () => {
                  let transaction = getTableData(transactionTable);
                  let inputoutput = getTableData(inputOutputTable)[0];
                  let employment = getTableData(employmentTable)[0];
                  let result = getEmploymentMultiplier(
                    transaction,
                    inputoutput,
                    employment
                  );
                  loadData(resultTable, result);
                },
              },
              {
                key: "basic:07",
                name: "Input or Supply Multiplier",
                callback: () => {
                  let transaction = getTableData(transactionTable);
                  let inputoutput = getTableData(inputOutputTable)[0];
                  let result = getInputOrSupplyMultiplier(
                    transaction,
                    inputoutput
                  );
                  loadData(resultTable, result);
                },
              },
            ],
          },
        },
        advance: {
          name: "Advance IO Analysis",
          submenu: {
            items: [
              {
                key: "advance:01",
                name: "Key Sector",
                callback: () => {
                  alert("This is a Key Sector function");
                },
              },
              {
                key: "advance:02",
                name: "Decomposition",
                callback: () => {
                  alert("This is a Decomposition function");
                },
              },
              {
                key: "advance:03",
                name: "MPM Analysis",
                callback: () => {
                  alert("This is a MPM Analysis function");
                },
              },
              {
                key: "advance:04",
                name: "Extraction Method",
                callback: () => {
                  alert("This is a Extraction Method function");
                },
              },
              {
                key: "advance:05",
                name: "Pull Analysis",
                callback: () => {
                  alert("This is a Pull Analysis function");
                },
              },
              {
                key: "advance:06",
                name: "Push Analysis",
                callback: () => {
                  alert(getTableData(transactionTable));
                },
              },
              {
                key: "advance:07",
                name: "FOI1",
                callback: () => {
                  loadData(resultTable, getTableData(transactionTable));
                },
              },
            ],
          },
        },
        separator2: ContextMenu.SEPARATOR,
        exportas_csv: {
          name: "Export as csv",
          callback: () => {
            downloadCSV(transactionTable);
          },
        },
        exportas_txt: {
          name: "Export as txt",
          callback: () => {
            alert("This is a Export as txt function");
          },
        },
      },
    },
      },
    };
  },
  methods: {},
};
</script>