<template>
  <div :class="$style.component">
    <div :class="$style.content">
      <h1>
        Spotify Cartography
      </h1>

      <v-btn
        outlined
        dark
        large
        color="#53A0FF"
        width="300"
        @click="login">
        <v-icon>mdi-spotify</v-icon>
        Login with Spotify
      </v-btn>

      <samples-dialog />
    </div>

    <floating-background />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';

import FloatingBackground from '@/components/ui/background/floating-background.vue';
import SamplesDialog from '@/components/ui/dialogs/samples-dialog/samples-dialog.vue';

export default Vue.extend({
  name: 'Welcome',

  components: {
    SamplesDialog,
    FloatingBackground,
  },

  methods: {
    ...mapActions('data', [
      'loadExampleData',
    ]),

    ...mapActions('auth', [
      'login',
    ]),
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 15vh;
  z-index: 10;

  h1 {
    display: block;
    font-size: 3rem;
    font-weight: 300;
    margin-bottom: 1rem;
  }

  button {
    margin-top: 2rem;

    i {
      padding-right: .4rem;
    }
  }
}
</style>
