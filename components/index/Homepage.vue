<template>
  <div class="flex h-hero-md lg:h-hero-lg 2xl:h-hero-xl justify-center items-center">
          <div class="text-center">
            <h1
              class="
              text-4xl
              font-bold
              leading-none
              tracking-tighter
              text-neutral-600
              md:text-5xl
              lg:text-6xl
            "
            >
              Calculate your
              <br class="hidden lg:block" /> input-output model
            </h1>
            <NuxtLink to="/demo">
              <button
                class="text-white border border-solid rounded-full bg-primary border-primary hover:bg-white hover:text-primary active:bg-white font-semibold px-8 py-2 rounded outline-none focus:outline-none my-5"
                type="button"
              >
                Try it
              </button>
            </NuxtLink>
          </div>
        </div>
</template>

<script>
export default {

}
</script>

<style>

</style>