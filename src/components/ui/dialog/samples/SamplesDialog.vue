<template>
  <v-dialog
    v-model="open"
    width="1200">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        outlined
        dark
        large
        color="#FF9F44"
        width="300"
        v-bind="attrs"
        v-on="on">
        <v-icon>mdi-hexagon-multiple-outline</v-icon>
        Continue with Sample Data
      </v-btn>
    </template>

    <v-card color="#222230F0">
      <v-card-title
        :class="$style.title"
        class="text-h5">
        Import Sample Data

        <v-btn
          outlined
          dark
          :disabled="active === -1"
          color="rgb(1, 162, 255)"
          @click="load">
          Import
        </v-btn>
      </v-card-title>

      <v-divider />

      <v-card-text>
        <div :class="$style.content">
          <div :class="$style.samples">
            <sample
              v-for="(sample, index) in samples"
              :key="sample.title"
              :sample="sample"
              :active="active"
              :index="index"
              @click="activate" />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

import Sample from './Sample.vue';
import { SAMPLES } from './config';

export default Vue.extend({
  name: 'Samples',

  components: {
    Sample,
  },

  data: () => ({
    open: false,

    samples: SAMPLES,

    active: -1,
  }),

  methods: {
    ...mapActions('data', [
      'loadExampleData',
    ]),

    async load() {
      if (this.active === -1) {
        return;
      }

      await this.loadExampleData(this.samples[this.active].key);
      this.$router.push('/cartography');
    },

    activate(index: number) {
      if (index === this.active) {
        this.active = -1;
      } else {
        this.active = index;
      }
    },
  },
});
</script>

<style>
.v-dialog > .v-card > .v-card__text {
  padding: 0;
}
</style>

<style lang="scss" module>
.title {
  display: flex;
  color: white;
  font-weight: 300 !important;
  justify-content: space-between;
}

.content {
  max-height: 500px;
  overflow: auto;

  &::-webkit-scrollbar {
  width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #07070725;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(248, 248, 248, 0.212);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.397);
  }
}

.samples {
  margin: 2rem 1rem;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
</style>
