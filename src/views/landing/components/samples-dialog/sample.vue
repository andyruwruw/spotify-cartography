<template>
  <div
    :class="[$style.component, {
      [$style['is-active']]: active === index,
    }]"
    @click="handleClick">
    <span
      :class="$style.headline"
      :style="{
        'color': sample.color,
      }">
      {{ sample.title }}
    </span>

    <span :class="$style.description">
      {{ sample.description }}
    </span>

    <div :class="$style.stat">
      <div :class="$style.label">
        Number of Samples: <span :class="$style.data">{{ stringifiedSampleSize }}</span>
      </div>
    </div>

    <div :class="$style.stat">
      <div :class="$style.label">
        Perplexity: <span :class="$style.data">{{ stringifiedPerplexity }}</span>
      </div>
    </div>

    <div :class="$style.stat">
      <div :class="$style.label">
        Epsilon: <span :class="$style.data">{{ sample.epsilon }}</span>
      </div>
    </div>

    <div :class="$style.stat">
      <div :class="$style.label">
        Iterations: <span :class="$style.data">{{ stringifiedIterations }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { SampleObject } from '../../config';

interface IComputed {
  stringifiedSampleSize: string;
  stringifiedPerplexity: string;
  stringifiedIterations: string;
}

interface IMethods {
  handleClick: () => void;
}

interface IProps {
  sample: SampleObject;
  active: number;
  index: number;
}

export default Vue.extend<Record<string, unknown>, IMethods, IComputed, IProps>({
  name: 'Sample',

  props: {
    sample: {
      type: Object,
      required: true,
    },

    active: {
      type: Number,
      default: -1,
    },

    index: {
      type: Number,
      required: true,
    },
  },

  computed: {
    stringifiedSampleSize() {
      return `${this.sample.sampleSize}`.replace(/(\d)(?=(\d\d\d)+$)/, '$1,');
    },
    stringifiedPerplexity() {
      return `${this.sample.perplexity}`.replace(/(\d)(?=(\d\d\d)+$)/, '$1,');
    },
    stringifiedIterations() {
      return `${this.sample.iterations}`.replace(/(\d)(?=(\d\d\d)+$)/, '$1,');
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
  flex-direction: column;
  max-width: 262px;
  margin-bottom: 3rem;
  padding: 1rem;
  border-radius: 1rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: border .2s ease-in-out, background-color .2s ease-in-out;

  &:hover {
    border: 1px solid rgba(255, 255, 255, 0.288);

    .headline {
      text-decoration: underline;
    }
  }

  &.is-active {
    background-color: rgba(255, 255, 255, 0.048);
  }

  .headline {
    color: white;
    font-size: 1.5rem;
    padding-bottom: 1rem;
  }

  .description {
    color: rgb(216, 214, 214);
    margin-bottom: 1rem;
  }

  .stat {
    margin: .5rem 0;
    .label {
      font-size: 1rem;
      color: rgba(161, 150, 150, 0.822);

      .data {
        color: rgba(255, 255, 255, 0.822);
      }
    }
  }

  .action {
    margin-top: 2rem;
  }
}
</style>
