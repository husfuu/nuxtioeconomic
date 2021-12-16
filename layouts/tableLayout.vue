<template>
  <div class="min-h-screen md:flex">
    <div
      v-if="showSidebar"
      class="sidebar bg-primary text-white md:w-1/5 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out"
    >
      <NuxtLink to="/">
        <a class="text-white flex items-center space-x-2 px-4">
          <span class="text-2xl font-extrabold">Recent Files</span>
        </a>
      </NuxtLink>
      <nav>
        <NuxtLink to="/">
          <a
            class="block py-2.5 px-4 rounded transition duration-200 hover:bg-secondary hover:text-white"
          >
            Home
          </a>
        </NuxtLink>
        <NuxtLink to="/try">
          <a
            class="block py-2.5 px-4 rounded transition duration-200 hover:bg-secondary hover:text-white"
          >
            Try
          </a>
        </NuxtLink>
      </nav>
    </div>

    <div class="flex-1 md:w-4/5">
      <nav class="w-full py-3 px-3 bg-white">
        <div class="px-4 md:px-1 w-auto mx-auto md:flex md:items-center">
          <div
            class="flex w-full md:flex-row justify-between items-center text-sm font-medium gap-x-3"
          >
            <button
              @click="sideBarEvent"
              type="button"
              class="text-primary focus:outline-none focus:shadow-outline"
            >
              <ion-icon name="menu" size="large" />
            </button>

            <NuxtLink to="/">
              <a
                class="text-2xl font-bold font- mt-0 mb-2 text-primary mx-auto"
              >
                IOEconomic
              </a>
            </NuxtLink>
          </div>
        </div>
      </nav>
      <div
        class="w-full h-view-md xl:h-view-hd 2xl:h-view-fhd overflow-auto px-4"
      >
        <Nuxt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showSidebar: false,
    };
  },
  methods: {
    sideBarEvent() {
      this.showSidebar = !this.showSidebar;
    },
  },
};
</script>

<style></style>
