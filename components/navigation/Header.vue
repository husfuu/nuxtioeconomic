<template>
  <nav class="w-full py-4 bg-white">
        <div class="container px-4 w-auto mx-auto md:flex md:items-center md:w-4/5 lg:w-3/5">
          <div class="flex w-full md:flex-row justify-between items-center text-sm font-medium">
            <NuxtLink to="/">
              <a class="p-2 md:mx-4 opacity-70 hover:opacity-100">Home</a>
            </NuxtLink>

            <NuxtLink to="/demo">
              <a class="p-2 md:mx-4 opacity-70 hover:opacity-100">Demo</a>
            </NuxtLink>

              <a href="https://www.linkedin.com/in/khoironiks/" class="p-2 md:mx-4 opacity-70 hover:opacity-100 cursor-pointer">
                About
              </a>

              <a href="https://www.linkedin.com/in/khoironiks/" class="p-2 md:mx-4 opacity-70 hover:opacity-100 cursor-pointer">
                Contact
              </a>
          </div>
        </div>
      </nav>
</template>

<script>
export default {

}
</script>

<style>

</style>