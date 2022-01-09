<template>
  <div :class="$style.component">
    <span :class="$style.title">
      Help
    </span>

    <div :class="$style.content">
      <span :class="$style.details">
        Welcome to Spotify Cartography!
        Every diamond you see in front of you is a song in your Spotify Library.
        Use the "T-SNE" tab to sort the songs, bumping "Iterations" up to 50 should give you some interesting results.
        You'll see a progress circle in the top-left once you click "Run".
        Hovering over a song you can see its name and statistics.
        Songs are grouped using these statistics, genre, artist, and anything else isn't considered.
      </span>

      <div :class="$style.notes">
        <div :class="$style.note">
          <v-icon
            color="white"
            x-large>
            mdi-rotate-orbit
          </v-icon>

          <div :class="$style.text">
            <span :class="headline">
              Rotate
            </span>

            <span :class="$style.subtext">
              Hold left-click and move the mouse to rotate around.
            </span>
          </div>
        </div>

        <div :class="$style.note">
          <v-icon
            color="white"
            x-large>
            mdi-pan
          </v-icon>

          <div :class="$style.text">
            <span :class="headline">
              Pan
            </span>

            <span :class="$style.subtext">
              Hold right-click and move the mouse to pan the camera.
            </span>
          </div>
        </div>

        <div :class="$style.note">
          <v-icon
            color="white"
            x-large>
            mdi-magnify-plus
          </v-icon>

          <div :class="$style.text">
            <span :class="headline">
              Zoom
            </span>

            <span :class="$style.subtext">
              Use the mouse wheel to zoom in and out.
            </span>
          </div>
        </div>

        <div :class="$style.note">
          <v-icon
            color="white"
            x-large>
            mdi-play-circle
          </v-icon>

          <div :class="$style.text">
            <span :class="headline">
              Play Songs
            </span>

            <span :class="$style.subtext">
              Hold "Ctrl" and click on a song to play it.
            </span>
          </div>
        </div>

        <div :class="$style.note">
          <v-icon
            color="white"
            x-large>
            mdi-chart-bar
          </v-icon>

          <div :class="$style.text">
            <span :class="headline">
              Song Details
            </span>

            <span :class="$style.subtext">
              Hover over a song to see its details.
            </span>
          </div>
        </div>

        <div :class="$style.note">
          <v-icon
            color="white"
            x-large>
            mdi-close-circle
          </v-icon>

          <div :class="$style.text">
            <span :class="headline">
              Close Tabs
            </span>

            <span :class="$style.subtext">
              Click on a tab again to close it.
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Help',
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

.details {
  font-weight: 200;
  max-width: 50rem;
  color: rgb(175, 174, 174);
  letter-spacing: 1px;
  font-size: .9rem;
  line-height: 2rem;
}

.notes {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  transform: translateY(-3.2rem);

  .note {
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(30% - 2rem);
    margin-top: 1rem;

    .text {
      display: flex;
      flex-direction: column;
      margin-left: 1rem;
      width: 100%;

      .headline {
        font-size: 1.2rem;
      }

      .subtext {
        font-size: 1rem;
        font-weight: 200;
        color: rgb(175, 174, 174);
      }
    }
  }
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
