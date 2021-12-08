<template>
  <div class="grid grid-rows-1 border-2">
    <div class="xl:w-full flex py-2 hidden justify-between sm:block bg-white">
      <div class="flex justify-between">
        <ul class="flex px-5">
          <li
            :class="{
              'text-primary': currenttab == 1,
              'text-gray-700': currenttab != 1,
            }"
            class="text-sm py-3 flex items-center mr-12 hover:text-primary cursor-pointer"
          >
            <div @click="setCurrentTab(1)" class="flex items-center">
              <span>
                <ion-icon name="analytics" />
              </span>
              <span class="ml-1 font-normal">Data</span>
            </div>
          </li>
          <!--  "text-sm border-primary pt-3 font-bold rounded-t text-primary mr-12" -->
          <li
            :class="{
              'text-primary': currenttab == 2,
              'text-gray-700': currenttab != 2,
            }"
            class="text-sm py-3 flex items-center mr-12 hover:text-primary cursor-pointer"
          >
            <div @click="setCurrentTab(2)" class="flex items-center">
              <ion-icon name="calculator" />
              <span class="ml-1 font-normal">Result</span>
            </div>
          </li>
        </ul>
        <div class="flex gap-x-4 mr-4">
          <!-- <button
            class="border border-primary text-primary font-medium cursor-pointer rounded-md px-4 py-2 transition duration-300 ease select-none hover:text-white hover:bg-primary focus:outline-none focus:shadow-outline"
            type="button"
          >
            Reset
          </button> -->
          <label
            class="border border-primary text-primary font-medium cursor-pointer rounded-md px-4 py-2 transition duration-300 ease select-none hover:text-white hover:bg-primary focus:outline-none focus:shadow-outline"
          >
            <span class="mt-2 text-base leading-normal">Load Data</span>
            <input type="file" class="hidden" v-on:change="previewFiles" />
          </label>
        </div>
      </div>
    </div>
    <div
      class="w-full rounded-sm border border-gray-200 h-table-md xl:h-table-hd 2xl:h-table-fhd overflow-auto"
    >
      <div v-show="currenttab === 1" class="grid grid-cols-1 gap-y-4">
        <div class="grid grid-cols-1 border-2">
          <div class="px-4 px-2 m-2 text-gray-700">Transaction</div>
          <TableTransaction />
        </div>
        <div class="grid grid-cols-1 border-2">
          <div class="px-4 px-2 m-2 text-gray-700">Input / Output</div>
          <TableInputOutput />
        </div>
        <div class="grid grid-cols-1 border-2">
          <div class="px-4 px-2 m-2 text-gray-700">Final Demand</div>
          <TableScenario />
        </div>
        <div class="grid grid-cols-1 border-2">
          <div class="px-4 px-2 m-2 text-gray-700">Income</div>
          <TableIncome />
        </div>
        <!-- <div class="grid grid-cols-1 border-2">
          <div class="px-4 px-2 m-2 text-gray-700">Transaction</div>
        <TableEmployment />
        </div> -->
      </div>
      <div v-show="currenttab === 2">
        <TableResult />
      </div>
    </div>
  </div>
</template>

<script>
import xlsx from "xlsx";
import {
  refreshSize,
  updatePattern,
  findTableinLayout,
  loadData,
} from "../lib/helpers";

export default {
  layout: "tableLayout",
  data() {
    return {
      currenttab: 1,
      inputoutputtable: "TableInputOutput",
      scenariotable: "TableScenario",
      incometable: "TableIncome",
      employmenttable: "TableEmployment",
      resulttable: "TableResult",
      transactiontable: "TableTransaction",
    };
  },
  methods: {
    setCurrentTab(tab) {
      this.currenttab = tab;
    },
    previewFiles(event) {
      let thefile = event.target.files[0];
      let fileReader = new FileReader();
      fileReader.readAsBinaryString(thefile);
      fileReader.onload = (event) => {
        let data = event.target.result;
        let workbook = xlsx.read(data, { type: "binary" });
        let firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        let result = xlsx.utils.sheet_to_json(firstSheet, { header: 1 });

        let length = result.length;
        let size = 9999;
        result.forEach((array) => {
          if (size > array.length) {
            size = array.length;
          }
        });
        let actualsize = size - 2;

        let transaction = [];
        for (let i = 1; i < size + 1; i++) {
          let temp = [];
          for (let j = 1; j < size + 1; j++) {
            temp.push(result[i][j]);
          }
          transaction.push(temp);
        }
        loadData(findTableinLayout(this, this.transactiontable), transaction);
        refreshSize(findTableinLayout(this, this.transactiontable));

        let inputoutput = [];
        for (let i = 1; i < size + 1; i++) {
          inputoutput.push(result[length - 1][i]);
        }
        loadData(findTableinLayout(this, this.inputoutputtable), [inputoutput]);

        let finaldemand = [];
        for (let i = 1; i < actualsize + 1; i++) {
          let temp = [];
          for (let j = actualsize + 2; j < result[1].length; j++) {
            temp.push(result[i][j]);
          }
          finaldemand.push(temp);
        }
        loadData(findTableinLayout(this, this.scenariotable), finaldemand);

        let income = [];
        for (let i = actualsize + 4; i < result.length - 4; i++) {
          let temp = [];
          for (let j = 1; j < size + 1; j++) {
            temp.push(result[i][j]);
          }
          income.push(temp);
        }
        loadData(findTableinLayout(this, this.incometable), income);
      };
    },
  },
};
</script>

<style></style>
