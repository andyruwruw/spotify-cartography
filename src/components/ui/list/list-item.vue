<template>
  <div
    :class="[$style.component, {
      [$style.active]: active,
    }]"
    @click="handleClick">
    <div
      :class="$style.image"
      :style="{
        'background-image': `url(${image})`,
      }" />

    <div :class="$style.details">
      <span :class="$style.name">
        {{ name }}
      </span>

      <span :class="$style.description">
        {{ description }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'ListItem',

  props: {
    index: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      default: 'Unnamed',
    },

    description: {
      type: String,
      default: 'No details',
    },

    active: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    handleClick() {
      this.$emit('click', this.index);
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  width: 100%;
  margin: 0 0 1rem;
  border: 1px solid rgba(255, 255, 255, 0);
  padding: .5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: border .2s ease;

  &.active {
    border: 1px solid rgb(240, 124, 70);
    background-color: rgba(240, 124, 70, 0.062);

    &:hover {
      border: 1px solid rgb(240, 70, 70);
    }
  }

  &:hover {
    border: 1px solid rgb(240, 124, 70);
  }
}

.image {
  display: block;
  width: 3rem;
  height: 3rem;
  background-size: auto 100%;
  background-position: center center;
  background-color: #222;
  margin-right: .8rem;
}

.details {
  display: flex;
  flex-direction: column;
  width: calc(100% - 3rem - .8rem - 1rem);

  .name {
    color: white;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    min-width: 0;
    max-width: 100%;
  }

  .description {
    color: rgba(255, 255, 255, 0.52);
    font-weight: 200;
  }
}
</style>
