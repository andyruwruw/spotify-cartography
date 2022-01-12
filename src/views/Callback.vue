<template>
  <div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Callback',

  async created() {
    await this.$store.dispatch('auth/callback', this.$route.hash.split('&')[0].slice(14));
    this.$store.dispatch('data/getTotal');

    this.$router.push('/menu');
  },
});
</script>
