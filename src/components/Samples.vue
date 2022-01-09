<template>
  <v-dialog
    v-model="open"
    width="1200">
    <v-card color="#222230c0">
      <v-card-title
        :class="$style.title"
        class="text-h5">
        Load Sample Data
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div :class="$style.samples">
          <div
            v-for="sample in samples"
            :key="sample.title"
            :class="$style.sample">
            <span
              :class="$style.headline"
              :style="{
                'color': sample.color,
              }">
              {{ sample.title }}
            </span>

            <div :class="$style.stat">
              <div :class="$style.label">
                Number of Samples: <span :class="$style.data">{{ sample.sampleSize }}</span>
              </div>
            </div>

            <div :class="$style.stat">
              <div :class="$style.label">
                Perplexity: <span :class="$style.data">{{ sample.perplexity }}</span>
              </div>
            </div>

            <div :class="$style.stat">
              <div :class="$style.label">
                Epsilon: <span :class="$style.data">{{ sample.epsilon }}</span>
              </div>
            </div>

            <div :class="$style.stat">
              <div :class="$style.label">
                Iterations: <span :class="$style.data">{{ sample.iterations }}</span>
              </div>
            </div>

            <div :class="$style.action">
              <v-btn
                color="rgb(1, 162, 255)"
                dark
                @click="load(sample.key)">
                Load Sample
              </v-btn>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

export default Vue.extend({
  name: 'Samples',

  data: () => ({
    open: true,
    samples: [
      {
        title: 'The Works',
        sampleSize: 6200,
        perplexity: 80,
        epsilon: 10,
        iterations: 1000,
        key: 'all',
        color: 'rgb(187, 74, 253)',
      },
      {
        title: 'Tiny',
        sampleSize: 1000,
        perplexity: 5,
        epsilon: 10,
        iterations: 1000,
        key: 'small',
        color: 'rgb(255, 196, 1)',
      },
      {
        title: 'Webbing',
        sampleSize: 1000,
        perplexity: 10,
        epsilon: 10,
        iterations: 1000,
        key: 'medium',
        color: 'rgb(240, 124, 70)',
      },
      {
        title: 'Globe',
        sampleSize: 1000,
        perplexity: 30,
        epsilon: 10,
        iterations: 1000,
        key: 'large',
        color: 'rgb(230, 245, 100)',
      },
      {
        title: 'Batman',
        sampleSize: 1000,
        perplexity: 100,
        epsilon: 10,
        iterations: 1000,
        key: 'x-large',
        color: 'rgb(1, 162, 255)',
      },
    ],
  }),

  methods: {
    ...mapActions('data', [
      'loadExampleData',
    ]),

    async load(id: string) {
      await this.loadExampleData(id);
      this.$router.push('/cartography');
    },
  },
});
</script>

<style lang="scss" module>
.title {
  color: white;
  font-weight: 300 !important;
}

.samples {
  margin: 2rem 1rem;
  display: flex;
  justify-content: space-around;

  .sample {
    display: flex;
    flex-direction: column;

    .headline {
      color: white;
      font-size: 1.5rem;
      padding-bottom: 1rem;
    }

    .stat {
      margin: .5rem;
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
}
</style>
