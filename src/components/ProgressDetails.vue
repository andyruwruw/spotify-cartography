<template>
  <div :class="$style.component">
    <v-progress-circular
      v-if="!isProcessDone"
      indeterminate
      color="green" />

    <span
      v-if="!isProcessDone"
      :class="$style.details">
      {{ getCurrentIteration }} / {{ getIterations }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  name: 'ProgressDetails',

  computed: {
    ...mapGetters('map', [
      'isProcessDone',
      'getCurrentIteration',
      'getIterations',
    ]),

    currentProgress() {
      console.log(Math.round((this.getCurrentIteration / this.getIterations) * 100));
      return Math.round((this.getCurrentIteration / this.getIterations) * 100);
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 64px;
  left: 0px;
  padding: 1rem;
  width: 120px;
}
</style>
