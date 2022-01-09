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
          @end="changeSettings">
          <template v-slot:append>
            <v-text-field
              v-model="perplexity.val"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="changeSettings" />
          </template>
        </v-slider>

        <v-slider
          v-model="epsilon.val"
          :color="epsilon.color"
          :label="epsilon.label"
          :max="epsilon.max"
          :min="epsilon.min"
          dark
          dense
          thumb-label
          @end="changeSettings">
          <template v-slot:append>
            <v-text-field
              v-model="epsilon.val"
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
          dark
          dense
          thumb-label
          @end="changeSettings">
          <template v-slot:append>
            <v-text-field
              v-model="iterations.val"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="changeSettings" />
          </template>
        </v-slider>
      </div>

      <v-btn
        color="red"
        dark
        @click="run">
        Run
      </v-btn>
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
      'getPerplexity',
      'getEpsilon',
      'getTracks',
      'getIterations',
      'getCurrentIteration',
    ]),
  },

  created() {
    this.perplexity.max = this.getTracks.length;
    this.perplexity.val = this.getPerplexity;
    this.epsilon.val = this.getEpsilon;
    this.iterations.val = this.getIterations;
  },

  methods: {
    ...mapActions('data', [
      'processData',
    ]),

    changeSettings() {
      this.$store.dispatch('data/changeSettings', {
        perplexity: this.perplexity.val,
        epsilon: this.epsilon.val,
        iterations: this.iterations.val,
      });
    },

    run() {
      this.processData();
    },
  },
});
</script>

<style lang="scss" module>
.component {
  width: 100vw;
  height: 100%;
  background-color: #2c2c3de1;
  animation: slide-in 0.3s ease;
  padding: 1rem;
}

.title {
  font-size: 1.5rem;
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

@keyframes slide-in {
  from {
    bottom: -240px;
  }
  to {
    bottom: 0;
  }
}
</style>
