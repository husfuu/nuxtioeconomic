<template>
  <div v-if="loading" class="flex min-w-full min-h-screen justify-center items-center bg-white">
    <div class="loading">
      <div class="balls">
        <div class="one" />
        <div class="two" />
        <div class="three" />
        <div class="four" />
        <div class="five" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      loading: true,
    }),
    methods: {
      start() {
        this.loading = true
      },
      finish() {
        this.loading = true
      },
    },
  }
</script>

<style src="~/assets/styles/css/loader.css"></style>