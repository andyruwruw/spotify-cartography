<template>
  <div :class="$style.component">
    <div :class="$style['select-wrapper']">
      <v-select
        v-model="limit"
        :items="limitOptions"
        label="Number of Songs"
        outlined
        dark
        :color="buttonColors.yellow" />

      <v-text-field
        v-model="customLimit"
        v-if="limit !== 'All Liked Songs'"
        :disabled="limit === 'All'"
        label="Custom Number of Songs"
        outlined
        dark
        type="number"
        placeholder="Enter a custom limit"
        :color="buttonColors.yellow">
      </v-text-field>
    </div>

    <div
      v-if="limit === 'Custom Amount'"
      :class="$style['select-wrapper']">
      <v-select
        v-model="offset"
        :items="offsetOptions"
        label="Starting Place"
        outlined
        dark
        :color="buttonColors.green" />

      <v-text-field
        v-model="customOffset"
        v-if="offset === 'Custom Place'"
        :disabled="offset === 'All'"
        label="Custom Starting Place"
        outlined
        dark
        single-line
        type="number"
        placeholder="Enter a custom offset"
        :color="buttonColors.green">
      </v-text-field>
    </div>

    <span :class="$style.selected">
      {{ selectedNum }}
    </span>

    <menu-navigation
      :disable-map="!ready"
      @back="back"
      @map="map" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';

import { REQUEST_TYPE } from '@/config';
import api from '@/api';
import { BUTTON_COLORS } from './config';
import MenuNavigation from './MenuNavigation.vue';

interface IData {
  buttonColors: Record<string, string>;
  requestTypes: Record<string, string>;
  total: number;
  limit: string;
  customLimit: string;
  limitOptions: string[];
  offset: string;
  customOffset: string;
  offsetOptions: string[];
}

interface IMethods {
  changeSettingsLimit: (limit: number) => void;
  changeSettingsOffset: (offset: number) => void;
  collectData: () => void;
  back: () => void;
  map: () => void;
}

interface IComputed {
  ready: boolean;
  selectedNum: string;
}

export default Vue.extend<IData, IMethods, IComputed>({
  name: 'LikedTracks',

  components: {
    MenuNavigation,
  },

  data: () => ({
    buttonColors: BUTTON_COLORS,
    requestTypes: REQUEST_TYPE,

    total: -1,

    limit: 'All Liked Songs',
    customLimit: '',

    limitOptions: [
      'All Liked Songs',
      'Custom Amount',
    ],

    offset: 'Last Added',
    customOffset: '0',

    offsetOptions: [
      'Last Added',
      'Custom Place',
    ],
  }),

  computed: {
    ready() {
      return (this.limit === 'All Liked Songs' || (this.limit === 'Custom Amount' && parseInt(this.customLimit, 10) > 0))
      && (this.offset === 'Last Added' || (this.offset === 'Custom Place' && parseInt(this.customOffset, 10) > 0));
    },

    selectedNum(): string {
      if (this.total === -1) {
        return 'Calculating selected total';
      }
      if (this.limit === 'All Liked Songs') {
        return `Selected all ${this.total.toString().replace(/(\d)(?=(\d\d\d)+$)/, '$1,')} songs`;
      }
      if (this.offset === 'Last Added') {
        if (this.customLimit !== '' && parseInt(this.customLimit, 10) > this.total) {
          return `Selected all ${this.total.toString().replace(/(\d)(?=(\d\d\d)+$)/, '$1,')} songs`;
        }
        return `Selected most recent ${this.customLimit.replace(/(\d)(?=(\d\d\d)+$)/, '$1,')} songs out of ${this.total.toString().replace(/(\d)(?=(\d\d\d)+$)/, '$1,')}`;
      }
      if (this.customLimit === '' || this.customOffset === '') {
        return 'Invalid selection';
      }
      if (parseInt(this.customOffset, 10) < 0 || parseInt(this.customLimit, 10) < 0) {
        return 'Invalid selection';
      }
      if (parseInt(this.customOffset, 10) + parseInt(this.customLimit, 10) > this.total) {
        return `Selected more songs than exist, oldest ${(this.total - parseInt(this.customOffset, 10)).toString().replace(/(\d)(?=(\d\d\d)+$)/, '$1,')} songs out of ${this.total.toString().replace(/(\d)(?=(\d\d\d)+$)/, '$1,')} selected`;
      }
      return `Selected ${this.customLimit.replace(/(\d)(?=(\d\d\d)+$)/, '$1,')} songs starting at ${this.customOffset.replace(/(\d)(?=(\d\d\d)+$)/, '$1,')} out of ${this.total.toString().replace(/(\d)(?=(\d\d\d)+$)/, '$1,')}`;
    },
  },

  async created() {
    this.total = await api.spotify.library.getNumberSavedTracks();
    this.customLimit = `${this.total}`;
  },

  methods: {
    ...mapActions('data', [
      'changeSettingsLimit',
      'changeSettingsOffset',
      'collectData',
    ]),

    back() {
      this.changeSettingsLimit(-1);
      this.changeSettingsOffset(-1);
      this.$emit('select', REQUEST_TYPE.NONE);
    },

    map() {
      this.changeSettingsLimit(this.limit === 'All Liked Songs' ? -1 : parseInt(this.customLimit, 10));
      this.changeSettingsOffset(this.offset === 'Last Added' ? -1 : parseInt(this.customOffset, 10));
      this.$router.push('/exploring');
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  flex-direction: column;
}

.button {
  justify-content: left;
}

.select-wrapper {
  width: 234px;
}

.selected {
  text-align: center;
  color: rgba(255, 255, 255, 0.363);
  font-weight: 200;
  max-width: 234px;
  margin-bottom: 1rem;
}
</style>
