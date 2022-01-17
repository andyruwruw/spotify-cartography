<template>
  <div
    :class="$style.component"
    @click="click">
    <span>
      {{ name }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Tab',

  props: {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
  },

  methods: {
    click() {
      this.$emit('click', this.id);
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #22223083;
  width: 10rem;
  height: 40px;
  margin: 0 .5rem;
  cursor: pointer;
  transition: background-color .2s ease-in-out;

  &:hover {
    background-color: #32324283;

    span {
      text-decoration: underline;
    }
  }
}
</style>
