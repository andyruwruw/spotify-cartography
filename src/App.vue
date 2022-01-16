<template>
  <v-app>
    <v-app-bar
      app
      color="transparent"
      dark
      flat>
      <div class="d-flex align-center">
        <span
          :class="$style.title"
          @click="goHome">
          Spotify Cartography
        </span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/andyruwruw/spotify-cartography"
        target="_blank"
        text>
        <span class="mr-2">Repository</span>
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  methods: {
    goHome() {
      if (this.$route.path !== '/') {
        this.$router.push('/');
      }
    },
  },
});
</script>

<style lang="scss" module>
.title {
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
