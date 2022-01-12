<template>
  <div>
    <menu-navigation
      :disableMap="false"
      @back="back" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

import { REQUEST_TYPE } from '@/config';
import MenuNavigation from './MenuNavigation.vue';

export default Vue.extend({
  name: 'Albums',

  components: {
    MenuNavigation,
  },

  methods: {
    ...mapActions('data', [
      'changeSettingsTimeRange',
    ]),

    back() {
      this.changeSettingsTimeRange('');
      this.$emit('select', REQUEST_TYPE.NONE);
    },
  },
});
</script>

<style lang="scss" module>

</style>
