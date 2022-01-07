<template>
  <div :class="$style.component">
    <div :class="$style.content">
      <h1>
        Spotify Cartography
      </h1>

      <v-btn
        color="#53A0FF"
        dark
        @click="login">
        <v-icon>mdi-spotify</v-icon>
        Login with Spotify
      </v-btn>

      <v-btn
        color="#FF9F44"
        dark>
        <v-icon>mdi-hexagon-multiple</v-icon>
        Example Data
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Welcome',

  methods: {
    login() {
      this.$store.dispatch('auth/login');
    },
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

  h1 {
    display: block;
    font-size: 3rem;
    font-weight: 300;
  }

  button {
    margin-top: 2rem;

    i {
      padding-right: .4rem;
    }
  }
}
</style>
