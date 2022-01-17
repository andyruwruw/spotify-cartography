<template>
  <div>
    <div
      :class="[$style.tabs, {
        [$style['tabs-active']]: tab !== requestTypes.NONE,
      }]">
      <tab
        v-for="tabObject in Object.values(tabs)"
        :key="tabObject.key"
        :name="tabObject.name"
        :id="tabObject.key"
        @click="openTab" />
    </div>

    <div
      v-if="tab !== requestTypes.NONE"
      :class="$style['open-tabs']">
      <process v-if="tab === 'tsne'" />

      <help v-if="tab === 'help'" />

      <weights v-if="tab === 'weights'" />
    </div>

    <div :class="$style.player">
      <current-track :track="track" />

      <statistics :track="track" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { REQUEST_TYPE } from '@/config';
import Tab from '@/components/ui/tab/tab.vue';

import { TABS } from '../../config';
import CurrentTrack from './current-track.vue';
import Statistics from './statistics.vue';
import Process from '../tabs/process.vue';
import Help from '../tabs/help.vue';
import Weights from '../tabs/weights.vue';

export default Vue.extend({
  name: 'Player',

  props: {
    track: {
      type: Object,
      default: null,
    },
  },

  components: {
    CurrentTrack,
    Process,
    Statistics,
    Tab,
    Help,
    Weights,
  },

  data: () => ({
    tabs: TABS,
    tab: REQUEST_TYPE.NONE,
    opened: 0,
    requestTypes: REQUEST_TYPE,
  }),

  methods: {
    openTab(id: string) {
      if (id === this.tab) {
        this.tab = REQUEST_TYPE.NONE;
      } else if (Date.now() - this.opened > 500) {
        this.tab = id;
        this.opened = Date.now();
      }
    },
  },
});
</script>

<style lang="scss" module>
.open-tabs {
  display: flex;
  position: fixed;
  bottom: 120px;
  left: 0;
  width: 100vw;
  height: 240px;
  animation: slide-in-tab 0.3s ease;
}

.tabs {
  display: flex;
  flex-direction: row-reverse;
  position: fixed;
  bottom: 120px;
  left: 0;
  width: calc(100vw - 2rem);
  transition: bottom .3s ease;

  &.tabs-active {
    bottom: 360px;
  }

  .tab {
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
}

.player {
  display: flex;
  position: fixed;
  width: 100vw;
  height: 120px;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  background: #222230c0;
  padding: 30px 24px;
}
</style>
