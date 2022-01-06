<template>
  <div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Callback',

  created() {
    console.log(this.$route.query);
  },
});
</script>
