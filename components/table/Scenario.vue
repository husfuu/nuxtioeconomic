<template>
  <div>
    <hot-table :settings="hotSettings" />
  </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import { ContextMenu } from "handsontable/plugins/contextMenu";

import "handsontable/dist/handsontable.full.css";
import { registerAllModules } from "handsontable/registry";
registerAllModules();

const tableset = require("../../data/tableset.json");
export default {
  components: {
    HotTable,
  },
  data() {
    return {
      hotSettings: {
        startCols: 3,
        startRows: 8,
        ...tableset,
        contextMenu: {
          items: {
            refresh: {
              name: "Refresh",
              callback: () => {
                refreshSize(this);
              },
            },
            row_above: {},
            row_below: {},

            col_left: {},
            col_right: {},

            remove_row: {},
            remove_col: {},

            alignment: {},
            separator2: ContextMenu.SEPARATOR,
            exportas_csv: {
              name: "Export as csv",
              callback: () => {
                downloadCSV(inputOutputTable);
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
