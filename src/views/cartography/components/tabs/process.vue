<template>
  <div :class="$style.component">
    <span :class="$style.title">
      t-SNE Controls
    </span>

    <div :class="$style.content">
      <div :class="$style.sliders">
        <v-slider
          v-model="perplexity.val"
          :color="perplexity.color"
          :label="perplexity.label"
          :max="perplexity.max"
          :min="perplexity.min"
          dark
          dense
          thumb-label
          :disabled="disableSliders"
          @end="changeSettings">
          <template v-slot:prepend>
            <v-text-field
              v-model="perplexity.val"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              :disabled="disableSliders"
              @change="changeSettings" />
          </template>
        </v-slider>

        <v-slider
          v-model="epsilon.val"
          :color="epsilon.color"
          :label="epsilon.label"
          :max="epsilon.max"
          :min="epsilon.min"
          :disabled="disableSliders"
          dark
          dense
          thumb-label
          @end="changeSettings">
          <template v-slot:prepend>
            <v-text-field
              v-model="epsilon.val"
              :disabled="disableSliders"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="changeSettings" />
          </template>
        </v-slider>

        <v-slider
          v-model="iterations.val"
          :color="iterations.color"
          :label="iterations.label"
          :max="iterations.max"
          :min="iterations.min"
          :disabled="disableSliders"
          dark
          dense
          thumb-label
          @end="changeSettings">
          <template v-slot:prepend>
            <v-text-field
              v-model="iterations.val"
              :disabled="disableSliders"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="changeSettings" />
          </template>
        </v-slider>
      </div>

      <div :class="$style.buttons">
        <v-btn
          color="red"
          dark
          width="71px"
          @click="run">
          {{ isProcessDone ? 'Run' : 'Stop' }}
        </v-btn>

        <v-btn
          color="blue"
          :disabled="disableSliders"
          dark
          width="71px"
          @click="save">
          Save
        </v-btn>
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
    perplexity: {
      min: 1,
      max: 50,
      label: 'Perplexity',
      val: 1,
      color: 'red',
    },
    epsilon: {
      min: 1,
      max: 50,
      label: 'Epsilon',
      val: 1,
      color: 'orange',
    },
    iterations: {
      min: 1,
      max: 20000,
      label: 'Iterations',
      val: 1,
      color: 'green',
    },
  }),

  computed: {
    ...mapGetters('data', [
      'getTracks',
    ]),

    ...mapGetters('map', [
      'getPerplexity',
      'getEpsilon',
      'getIterations',
      'getCurrentIteration',
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
    this.perplexity.max = this.getTracks.length;
    this.perplexity.val = this.getPerplexity;
    this.epsilon.val = this.getEpsilon;
    this.iterations.val = this.getIterations;
  },

  methods: {
    ...mapActions('map', [
      'processData',
      'abort',
    ]),

    ...mapActions('data', [
      'save',
    ]),

    changeSettings() {
      this.$store.dispatch('map/changeSettings', {
        perplexity: this.perplexity.val,
        epsilon: this.epsilon.val,
        iterations: this.iterations.val,
      });
    },

    run() {
      if (this.isProcessDone) {
        this.processData();
      } else {
        this.abort();
      }
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
  width: calc(100% - 36px - 2rem - 2rem);
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
