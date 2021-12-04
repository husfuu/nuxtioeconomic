<template>
  <div class="grid grid-rows-1 border-2">
    <div class="xl:w-full flex py-2 hidden justify-between sm:block bg-white">
      <div class="flex justify-between">
        <ul class="flex px-5">
          <li :class="{'text-primary':currenttab == 1, 'text-gray-700':currenttab != 1}" class="text-sm py-3 flex items-center mr-12 hover:text-primary cursor-pointer">
            <div @click="setCurrentTab(1)" class="flex items-center">
              <span>
                <ion-icon name="analytics" />
              </span>
              <span class="ml-1 font-normal">Data</span>
            </div>
          </li>
          <!--  "text-sm border-primary pt-3 font-bold rounded-t text-primary mr-12" -->
          <li :class="{'text-primary':currenttab == 2, 'text-gray-700':currenttab != 2}" class="text-sm py-3 flex items-center mr-12 hover:text-primary cursor-pointer">
            <div @click="setCurrentTab(2)" class="flex items-center">
              <ion-icon name="calculator" />
              <span class="ml-1 font-normal">Result</span>
            </div>
          </li>
        </ul>
        <div class="flex gap-x-4 mr-4">
          <button class="border border-primary text-primary font-medium cursor-pointer rounded-md px-4 py-2 transition duration-300 ease select-none hover:text-white hover:bg-primary focus:outline-none focus:shadow-outline" type="button">
            Reset
          </button>
          <label class="border border-primary text-primary font-medium cursor-pointer rounded-md px-4 py-2 transition duration-300 ease select-none hover:text-white hover:bg-primary focus:outline-none focus:shadow-outline">
            <span class="mt-2 text-base leading-normal">Load Data</span>
            <input type="file" class="hidden" />
          </label>
        </div>
      </div>
    </div>
    <div class="w-full rounded-sm border border-gray-200 h-table-md xl:h-table-hd 2xl:h-table-fhd overflow-auto">
      <div v-show="currenttab === 1" class="grid grid-cols-1 gap-y-4">
        <TableTransaction/>
        <TableInputOutput/>
        <TableScenario/>
        <TableIncome/>
        <TableEmployment/>
      </div>
      <div v-show="currenttab === 2">
        <TableResult/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "tableLayout",
  data() {
      return {
        currenttab: 1
      }
  },
  methods: {
    setCurrentTab(tab){
      this.currenttab = tab
    }
  }
}
</script>

<style>

</style>