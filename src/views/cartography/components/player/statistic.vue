<template>
  <div :class="$style.component">
    <v-tooltip
      v-if="display !== 'text'"
      color="#191927"
      bottom>
      <template v-slot:activator="{ on, attrs }">
        <span
          :class="$style.bar"
          v-bind="attrs"
          v-on="on">
          <span
            :class="$style.fill"
            :style="{
              'width': `${dataAvailable ? 100 * normalizedValue : 0}%`,
              'background-color': color,
            }" />
        </span>
      </template>

      <span>
        {{ valueDescription }}: {{ dataAvailable ? displayValue : 0 }}{{ valueUnit }}
      </span>
    </v-tooltip>

    <v-tooltip
      v-if="display !== 'text'"
      color="#191927"
      bottom>
      <template v-slot:activator="{ on, attrs }">
        <span
          :class="$style.label"
          :style="{
            'color': labelColor,
          }"
          v-bind="attrs"
          v-on="on">
          {{ name }}
          <v-icon :color="dataAvailable ? color : 'rgba(255, 255, 255, 0.267)'" x-small>
            mdi-help-circle
          </v-icon>
        </span>
      </template>

      <span>
        {{ description }}
      </span>
    </v-tooltip>

    <span
      v-if="display === 'text'"
      :class="$style.label">
      {{ dataAvailable ? `Added ${addedDate}` : 'No Date to Display' }}
    </span>
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import Vue from 'vue';

interface IComputed {
  dataAvailable: boolean;
  displayValue: number;
  normalizedValue: number;
  labelColor: string;
  addedDate: string;
}

interface IProps {
  name: string;
  description: string;
  valueDescription: string;
  value: number;
  max: number;
  valueUnit: string;
  color: string;
  display: string;
}

export default Vue.extend<Record<string, unknown>, Record<string, unknown>, IComputed, IProps>({
  name: 'Statistics',

  props: {
    name: {
      type: String,
      default: 'Unknown',
    },

    description: {
      type: String,
      default: 'This value does not have a description.',
    },

    valueDescription: {
      type: String,
      default: 'Unknown',
    },

    value: {
      type: Number,
      required: true,
    },

    max: {
      type: Number,
      default: 1,
    },

    valueUnit: {
      type: String,
      default: '%',
    },

    color: {
      type: String,
      default: 'rgb(255, 196, 1)',
    },

    display: {
      type: String,
      default: 'percent',
    },
  },

  computed: {
    dataAvailable() {
      return this.value !== -1;
    },

    displayValue() {
      if (!this.dataAvailable) {
        return 0;
      }

      switch (this.display) {
        case 'percent':
          return Math.round(this.normalizedValue * 100);
        default:
          return Math.round(this.value);
      }
    },

    normalizedValue() {
      if (!this.dataAvailable) {
        return 0;
      }

      return this.value / this.max;
    },

    labelColor() {
      if (!this.dataAvailable) {
        return 'rgba(255, 255, 255, 0.267)';
      }

      return this.color;
    },

    addedDate() {
      if (!this.dataAvailable) {
        return '';
      }

      if (this.value === 0) {
        return 'Date Unknown';
      }

      return moment(this.value).format('MMM Do, YYYY');
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
  margin-bottom: .6rem;

  .bar {
    display: flex;
    width: 8vw;
    max-width: 200px;
    height: .4rem;
    border-radius: 1px;
    background-color: rgba(255, 255, 255, 0.178);

    .fill {
      display: block;
      height: 100%;
      background-color: red;
      transition: width .5s ease-in-out;
    }
  }

  .label {
    margin: .1rem 0 .2rem;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.466);
    cursor: help;
    transition: color .5s ease-in-out;
  }
}
</style>
