<template>
  <div :class="$style.component">
    <div
      v-for="(column, index) in getStatistics"
      :key="`statistic-column-${index}`"
      :class="$style['stat-column']">
      <statistic
        v-for="statistic in column"
        :key="statistic.name"
        :name="statistic.name"
        :description="statistic.description"
        :valueDescription="statistic.valueDescription"
        :value="statistic.value"
        :max="statistic.max"
        :valueUnit="statistic.valueUnit"
        :color="statistic.color"
        :display="statistic.display" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { Track } from '@/config';

import { STATISTIC_DETAILS } from '../../config';
import Statistic from './statistic.vue';

export default Vue.extend({
  name: 'Statistics',

  components: {
    Statistic,
  },

  props: {
    track: {
      type: Object,
      default: null,
    },
  },

  computed: {
    getStatistics() {
      if (!this.track) {
        return [
          [
            STATISTIC_DETAILS.valence(),
            STATISTIC_DETAILS.acousticness(),
          ],
          [
            STATISTIC_DETAILS.energy(),
            STATISTIC_DETAILS.liveness(),
          ],
          [
            STATISTIC_DETAILS.danceability(),
            STATISTIC_DETAILS.instrumentalness(),
          ],
          [
            STATISTIC_DETAILS.popularity(),
            STATISTIC_DETAILS.speechiness(),
          ],
          [
            STATISTIC_DETAILS.tempo(),
            STATISTIC_DETAILS.added(),
          ],
        ];
      }
      return [
        [
          STATISTIC_DETAILS.valence(this.track.audioFeatures.valence),
          STATISTIC_DETAILS.acousticness(this.track.audioFeatures.acousticness),
        ],
        [
          STATISTIC_DETAILS.energy(this.track.audioFeatures.energy),
          STATISTIC_DETAILS.liveness(this.track.audioFeatures.liveness),
        ],
        [
          STATISTIC_DETAILS.danceability(this.track.audioFeatures.danceability),
          STATISTIC_DETAILS.instrumentalness(this.track.audioFeatures.instrumentalness),
        ],
        [
          STATISTIC_DETAILS.popularity(this.track.audioFeatures.popularity),
          STATISTIC_DETAILS.speechiness(this.track.audioFeatures.speechiness),
        ],
        [
          STATISTIC_DETAILS.tempo(this.track.audioFeatures.tempo),
          STATISTIC_DETAILS.added('added' in (this.track as Track).attatchedData ? (this.track as Track).attatchedData.added as number : 0),
        ],
      ];
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: calc(100vw - 60px - 48px - 21rem - 10rem);
  padding: 0 5rem;

  .stat-column {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
  }
}
</style>
