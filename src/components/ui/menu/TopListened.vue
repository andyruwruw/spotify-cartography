<template>
  <div :class="$style.component">
    <div
      v-for="button in buttons"
      :key="button.key"
      :class="$style['button-wrapper']">
      <v-btn
        :text="getTimeRange !== button.key"
        :outlined="getTimeRange === button.key"
        dark
        large
        block
        style="margin-bottom: 1rem"
        :class="$style.button"
        :color="button.color"
        @click="selectOption(button.key)">
        <v-icon style="margin-right: .5rem">{{ button.icon }}</v-icon>
        {{ button.label }}
      </v-btn>
    </div>

    <menu-navigation
      :disableMap="getTimeRange === ''"
      @back="back"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  mapActions,
  mapGetters,
} from 'vuex';

import { REQUEST_TYPE } from '@/config';
import { BUTTON_COLORS } from './config';
import MenuNavigation from './MenuNavigation.vue';

export default Vue.extend({
  name: 'TopListened',

  components: {
    MenuNavigation,
  },

  data: () => ({
    requestTypes: REQUEST_TYPE,
    buttonColors: BUTTON_COLORS,

    buttons: [
      {
        label: 'Several Years',
        color: BUTTON_COLORS.yellow,
        key: 'long_term',
        icon: 'mdi-calendar-multiple',
      },
      {
        label: 'Several Months',
        color: BUTTON_COLORS.orange,
        key: 'medium_term',
        icon: 'mdi-calendar-month',
      },
      {
        label: 'Several Weeks',
        color: BUTTON_COLORS.purple,
        key: 'short_term',
        icon: 'mdi-calendar-range',
      },
    ],
  }),

  computed: {
    ...mapGetters('data', [
      'getTimeRange',
    ]),
  },

  methods: {
    ...mapActions('data', [
      'changeSettingsTimeRange',
    ]),

    selectOption(key: string) {
      if (key === this.getTimeRange) {
        this.changeSettingsTimeRange('');
      } else {
        this.changeSettingsTimeRange(key);
      }
    },

    back() {
      this.changeSettingsTimeRange('');
      this.$emit('select', REQUEST_TYPE.NONE);
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  flex-direction: column;
}

.button-wrapper {
  width: 100%;
}

.button {
  justify-content: left;
}
</style>
