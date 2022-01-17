<template>
  <div :class="$style.component">
    <span :class="$style.title">
      How important is each statistic?
    </span>

    <div :class="$style.content">
      <div :class="$style.sliders">
        <v-slider
          v-model="valence.val"
          :color="valence.color"
          :label="valence.label"
          :max="valence.max"
          :min="valence.min"
          :step=".1"
          dark
          dense
          thumb-label
          :disabled="disableSliders"
          @end="changeSettings" />

        <v-slider
          v-model="popularity.val"
          :color="popularity.color"
          :label="popularity.label"
          :max="popularity.max"
          :min="popularity.min"
          :disabled="disableSliders"
          :step=".1"
          dark
          dense
          thumb-label
          @end="changeSettings" />

        <v-slider
          v-model="liveness.val"
          :color="liveness.color"
          :label="liveness.label"
          :max="liveness.max"
          :min="liveness.min"
          :disabled="disableSliders"
          :step=".1"
          dark
          dense
          thumb-label
          @end="changeSettings" />
      </div>

      <div :class="$style.sliders">
        <v-slider
          v-model="energy.val"
          :color="energy.color"
          :label="energy.label"
          :max="energy.max"
          :min="energy.min"
          :step=".1"
          dark
          dense
          thumb-label
          :disabled="disableSliders"
          @end="changeSettings" />

        <v-slider
          v-model="tempo.val"
          :color="tempo.color"
          :label="tempo.label"
          :max="tempo.max"
          :min="tempo.min"
          :disabled="disableSliders"
          :step=".1"
          dark
          dense
          thumb-label
          @end="changeSettings" />

        <v-slider
          v-model="instrumentalness.val"
          :color="instrumentalness.color"
          :label="instrumentalness.label"
          :max="instrumentalness.max"
          :min="instrumentalness.min"
          :disabled="disableSliders"
          :step=".1"
          dark
          dense
          thumb-label
          @end="changeSettings" />
      </div>

      <div :class="$style.sliders">
        <v-slider
          v-model="danceability.val"
          :color="danceability.color"
          :label="danceability.label"
          :max="danceability.max"
          :min="danceability.min"
          :step=".1"
          dark
          dense
          thumb-label
          :disabled="disableSliders"
          @end="changeSettings" />

        <v-slider
          v-model="acousticness.val"
          :color="acousticness.color"
          :label="acousticness.label"
          :max="acousticness.max"
          :min="acousticness.min"
          :disabled="disableSliders"
          :step=".1"
          dark
          dense
          thumb-label
          @end="changeSettings" />

        <v-slider
          v-model="speechiness.val"
          :color="speechiness.color"
          :label="speechiness.label"
          :max="speechiness.max"
          :min="speechiness.min"
          :disabled="disableSliders"
          :step=".1"
          dark
          dense
          thumb-label
          @end="changeSettings" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';

export default Vue.extend({
  name: 'Process',

  data: () => ({
    valence: {
      min: 0,
      max: 1,
      label: 'Happiness',
      val: 1,
      color: 'rgb(255, 196, 1)',
    },
    energy: {
      min: 0,
      max: 1,
      label: 'Energy',
      val: 1,
      color: 'rgb(1, 162, 255)',
    },
    danceability: {
      min: 0,
      max: 1,
      label: 'Danceability',
      val: 1,
      color: 'rgb(187, 74, 253)',
    },
    acousticness: {
      min: 0,
      max: 1,
      label: 'Acousticness',
      val: 1,
      color: 'rgb(248, 91, 91)',
    },
    liveness: {
      min: 0,
      max: 1,
      label: 'Liveness',
      val: 1,
      color: 'rgb(159, 255, 121)',
    },
    speechiness: {
      min: 0,
      max: 1,
      label: 'Speechiness',
      val: 1,
      color: 'rgb(255, 82, 241)',
    },
    instrumentalness: {
      min: 0,
      max: 1,
      label: 'Instrumentalness',
      val: 1,
      color: 'rgb(65, 255, 214)',
    },
    tempo: {
      min: 0,
      max: 1,
      label: 'Tempo',
      val: 1,
      color: 'rgb(240, 124, 70)',
    },
    popularity: {
      min: 0,
      max: 1,
      label: 'Popularity',
      val: 1,
      color: 'rgb(230, 245, 100)',
    },
  }),

  computed: {
    ...mapGetters('preferences', [
      'getValenceWeight',
      'getEnergyWeight',
      'getDanceabilityWeight',
      'getAcousticnessWeight',
      'getLivelinessWeight',
      'getSpeechinessWeight',
      'getInstrumentalnessWeight',
      'getTempoWeight',
      'getPopularityWeight',
    ]),

    ...mapGetters('map', [
      'isProcessDone',
    ]),

    disableSliders() {
      if (!this.isProcessDone) {
        return true;
      }
      return false;
    },
  },

  created() {
    this.valence.val = this.getValenceWeight;
    this.energy.val = this.getEnergyWeight;
    this.danceability.val = this.getDanceabilityWeight;
    this.acousticness.val = this.getAcousticnessWeight;
    this.liveness.val = this.getLivelinessWeight;
    this.speechiness.val = this.getSpeechinessWeight;
    this.instrumentalness.val = this.getInstrumentalnessWeight;
    this.tempo.val = this.getTempoWeight;
    this.popularity.val = this.getPopularityWeight;
  },

  methods: {
    ...mapActions('preferences', [
      'setWeights',
    ]),

    changeSettings() {
      this.setWeights({
        valenceWeight: this.valence.val,
        energyWeight: this.energy.val,
        danceabilityWeight: this.danceability.val,
        acousticnessWeight: this.acousticness.val,
        livenessWeight: this.liveness.val,
        speechinessWeight: this.speechiness.val,
        instrumentalnessWeight: this.instrumentalness.val,
        tempoWeight: this.tempo.val,
        popularityWeight: this.popularity.val,
      });
    },
  },
});
</script>

<style lang="scss" module>
.component {
  width: 100vw;
  height: 100%;
  background-color: #2c2c3de1;
  animation: slide-in 0.5s ease;
  padding: 1rem;
}

.title {
  font-size: 1.2rem;
  font-weight: 300;
}

.content {
  display: flex;
  justify-content: space-between;
  padding-right: 2rem;
  margin-top: 1rem;
}

.sliders {
  width: calc(33% - 2rem);
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  height: 90px;
  justify-content: space-between;
}

@keyframes slide-in {
  from {
    bottom: -240px;
  }
  to {
    bottom: 0;
  }
}
</style>
