<template>
    <div>
        <CommonLoader v-if="loading"/>
        <NavigationHeader/>
            <Nuxt/>
        <NavigationFooter/>
    </div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
};
</script>

<style>

</style>