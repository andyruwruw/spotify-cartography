<template>
  <div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Callback',

  created() {
    this.$store.dispatch('auth/callback', this.$route.hash.split('&')[0].slice(14));

    this.$router.push('/exploring');
  },
});
</script>
