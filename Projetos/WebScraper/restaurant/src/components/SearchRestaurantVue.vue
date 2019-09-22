<template>
  <span>
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-md-6 justify-self-center">
         <slot />
        </div>
      </div>
    </div>
  </span>
</template>

<script>
export default {
  name: 'SearchRestaurantVue',

  data () {

    return {
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
