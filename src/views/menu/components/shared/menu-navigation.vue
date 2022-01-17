<template>
  <div :class="$style.component">
    <v-btn
      :class="$style.button"
      :color="buttonColors.red"
      style="margin: 0 0 1rem"
      width="234"
      dark
      text
      @click="back()" >
      <v-icon style="margin-right: .5rem">
        mdi-arrow-left
      </v-icon>
      Back
    </v-btn>

    <v-btn
      :class="$style.button"
      :color="buttonColors.blue"
      :disabled="disableMap"
      width="234"
      dark
      text
      @click="map">
      <v-icon style="margin-right: .5rem">
        mdi-map-legend
      </v-icon>
      Let's Map It
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { BUTTON_COLORS } from '../../config';

export default Vue.extend({
  name: 'MenuNavigation',

  props: {
    disableMap: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    buttonColors: BUTTON_COLORS,
  }),

  methods: {
    back() {
      this.$emit('back');
    },

    map() {
      this.$emit('map');
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
}

.button {
  justify-content: left;
}
</style>
