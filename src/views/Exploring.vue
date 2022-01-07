<template>
  <div>
    <h2>
      {{ progressUpdate }}
    </h2>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'Exploring',

  computed: {
    ...mapGetters('auth', [
      'isAuthenticated',
    ]),
    ...mapGetters('data', [
      'getProgress',
    ]),
    progressUpdate() {
      return `${Math.floor(this.getProgress * 100)}%`;
    },
  },

  created() {
    if (!this.isAuthenticated) {
      this.$router.push('/welcome');
    } else {
      this.$store.dispatch('data/collectData');
    }
  },
});
</script>
