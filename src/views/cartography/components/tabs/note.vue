<template>
  <div :class="$style.component">
    <v-icon
      color="white"
      x-large>
      {{ icon }}
    </v-icon>

    <div :class="$style.text">
      <span :class="$style.headline">
        {{ title }}
      </span>

      <span :class="$style.subtext">
        {{ description }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Note',

  props: {
    title: {
      type: String,
      default: 'Title',
    },

    description: {
      type: String,
      default: 'Description of note.',
    },

    icon: {
      type: String,
      default: 'mdi-rotate-orbit',
    },

    color: {
      type: String,
      default: 'rgb(255, 196, 1)',
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(30% - 2rem);
  margin-top: 1rem;

  .text {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    width: 100%;

    .headline {
      font-size: 1rem;
    }

    .subtext {
      font-size: 1rem;
      font-weight: 200;
      color: rgb(175, 174, 174);
    }
  }
}
</style>
