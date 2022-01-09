<template>
  <div :class="$style.component">
    <div :class="$style.song">
      <div
        :class="$style.image"
        :style="{
          'background-image': `url('${display ? track.image : '#'}')`,
        }" />

      <div :class="$style.details">
        <span
          v-if="display"
          :class="$style.title"
          @click="link">
          {{ track.name }}
        </span>

        <span
          v-if="!display"
          :class="$style['title-skeleton-loader']" />

        <span
          v-if="display"
          :class="$style.artists">
          {{ track.artist }}
        </span>

        <span
          v-if="!display"
          :class="$style['artists-skeleton-loader']" />
      </div>
    </div>

    <div
      :class="[$style.stats, {
        [$style['not-display']]: !display,
      }]">
      <div :class="$style['stat-column']">
        <div :class="[$style.stat, $style.valence]">
          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.bar"
                v-bind="attrs"
                v-on="on">
                <span
                  :class="$style.fill"
                  :style="{
                    'width': `${display ? 100 * track.audioFeatures.valence : 0}%`,
                  }"/>
              </span>
            </template>
            <span>Happiness: {{ display ? Math.round(100 * track.audioFeatures.valence) : 0 }}%</span>
          </v-tooltip>

          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.label"
                v-bind="attrs"
                v-on="on">
                Happiness
                <v-icon :color="display ? 'rgb(255, 196, 1)' : 'rgba(255, 255, 255, 0.267)'" x-small>mdi-help-circle</v-icon>
              </span>
            </template>
            <span>Tracks with high valence (happiness) sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry).</span>
          </v-tooltip>
        </div>

        <div :class="[$style.stat, $style.acousticness]">
          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.bar"
                v-bind="attrs"
                v-on="on">
                <span
                  :class="$style.fill"
                  :style="{
                    'width': `${display ? 100 * track.audioFeatures.acousticness : 0}%`,
                  }"/>
              </span>
            </template>
            <span>Chance Track is Accoustic: {{ display ? Math.round(100 * track.audioFeatures.acousticness) : 0 }}%</span>
          </v-tooltip>

          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.label"
                v-bind="attrs"
                v-on="on">
                Acousticness
                <v-icon :color="display ? 'rgb(248, 91, 91)' : 'rgba(255, 255, 255, 0.267)'" x-small>mdi-help-circle</v-icon>
              </span>
            </template>
            <span>A confidence measure from 0.0 to 1.0 of whether the track is acoustic.</span>
          </v-tooltip>
        </div>
      </div>

      <div :class="$style['stat-column']">
        <div :class="[$style.stat, $style.energy]">
          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.bar"
                v-bind="attrs"
                v-on="on">
                <span
                  :class="$style.fill"
                  :style="{
                    'width': `${display ? 100 * track.audioFeatures.energy : 0}%`,
                  }" />
              </span>
            </template>
            <span>Energy: {{ display ? Math.round(100 * track.audioFeatures.energy) : 0 }}%</span>
          </v-tooltip>

          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.label"
                v-bind="attrs"
                v-on="on">
                Energy
                <v-icon :color="display ? 'rgb(1, 162, 255)' : 'rgba(255, 255, 255, 0.267)'" x-small>mdi-help-circle</v-icon>
              </span>
            </template>
            <span>Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.</span>
          </v-tooltip>
        </div>

        <div :class="[$style.stat, $style.liveness]">
          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.bar"
                v-bind="attrs"
                v-on="on">
                <span
                  :class="$style.fill"
                  :style="{
                    'width': `${display ? 100 * track.audioFeatures.liveness : 0}%`,
                  }" />
              </span>
            </template>
            <span>Chance Track is Live: {{ display ? Math.round(100 * track.audioFeatures.liveness) : 0 }}%</span>
          </v-tooltip>

          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.label"
                v-bind="attrs"
                v-on="on">
                Liveness
                <v-icon :color="display ? 'rgb(159, 255, 121)' : 'rgba(255, 255, 255, 0.267)'" x-small>mdi-help-circle</v-icon>
              </span>
            </template>
            <span>Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live.</span>
          </v-tooltip>
        </div>
      </div>

      <div :class="$style['stat-column']">
        <div :class="[$style.stat, $style.danceability]">
          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.bar"
                v-bind="attrs"
                v-on="on">
                <span
                  :class="$style.fill"
                  :style="{
                    'width': `${display ? 100 * track.audioFeatures.danceability : 0}%`,
                  }" />
              </span>
            </template>
            <span>Danceability: {{ display ? Math.round(100 * track.audioFeatures.danceability) : 0 }}%</span>
          </v-tooltip>

          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.label"
                v-bind="attrs"
                v-on="on">
                Danceability
                <v-icon :color="display ? 'rgb(187, 74, 253)' : 'rgba(255, 255, 255, 0.267)'" x-small>mdi-help-circle</v-icon>
              </span>
            </template>
            <span>Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity.</span>
          </v-tooltip>
        </div>

        <div :class="[$style.stat, $style.instrumentalness]">
          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.bar"
                v-bind="attrs"
                v-on="on">
                <span
                  :class="$style.fill"
                  :style="{
                    'width': `${display ? 100 * track.audioFeatures.instrumentalness : 0}%`,
                  }" />
              </span>
            </template>
            <span>Chance Track is Instrumental: {{ display ? Math.round(100 * track.audioFeatures.instrumentalness) : 0 }}%</span>
          </v-tooltip>

          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.label"
                v-bind="attrs"
                v-on="on">
                Instrumentalness
                <v-icon :color="display ? 'rgb(65, 255, 214)' : 'rgba(255, 255, 255, 0.267)'" x-small>mdi-help-circle</v-icon>
              </span>
            </template>
            <span>Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context.</span>
          </v-tooltip>
        </div>
      </div>

      <div :class="$style['stat-column']">
        <div :class="[$style.stat, $style.popularity]">
          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.bar"
                v-bind="attrs"
                v-on="on">
                <span
                  :class="$style.fill"
                  :style="{
                    'width': `${display ? track.audioFeatures.popularity : 0}%`,
                  }" />
                  </span>
            </template>
            <span>Popularity: {{ display ? Math.round(track.audioFeatures.popularity) : 0 }}%</span>
          </v-tooltip>

          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.label"
                v-bind="attrs"
                v-on="on">
                Popularity
                <v-icon :color="display ? 'rgb(230, 245, 100)' : 'rgba(255, 255, 255, 0.267)'" x-small>mdi-help-circle</v-icon>
              </span>
            </template>
            <span>The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are.</span>
          </v-tooltip>
        </div>

        <div :class="[$style.stat, $style.speechiness]">
          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.bar"
                v-bind="attrs"
                v-on="on">
                <span
                  :class="$style.fill"
                  :style="{
                    'width': `${display ? 100 * track.audioFeatures.speechiness : 0}%`,
                  }" />
              </span>
            </template>
            <span>Amount of Spoken Word: {{ display ? Math.round(100 * track.audioFeatures.speechiness) : 0 }}%</span>
          </v-tooltip>

          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.label"
                v-bind="attrs"
                v-on="on">
                Speechiness
                <v-icon :color="display ? 'rgb(255, 82, 241)' : 'rgba(255, 255, 255, 0.267)'" x-small>mdi-help-circle</v-icon>
              </span>
            </template>
            <span>Speechiness detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music.</span>
          </v-tooltip>
        </div>
      </div>

      <div :class="$style['stat-column']">
        <div :class="[$style.stat, $style.tempo]">
          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.bar"
                v-bind="attrs"
                v-on="on">
                <span
                  :class="$style.fill"
                  :style="{
                    'width': `${display ? 100 * (track.audioFeatures.tempo / 300) : 0}%`,
                  }" />
              </span>
            </template>
            <span>Tempo: {{ display ? Math.round(track.audioFeatures.tempo) : 0 }} BPM</span>
          </v-tooltip>

          <v-tooltip
            color="#191927"
            bottom>
            <template v-slot:activator="{ on, attrs }">
              <span
                :class="$style.label"
                v-bind="attrs"
                v-on="on">
                Tempo
                <v-icon :color="display ? 'rgb(240, 124, 70)' : 'rgba(255, 255, 255, 0.267)'" x-small>mdi-help-circle</v-icon>
              </span>
            </template>
            <span>The overall estimated tempo of a track in beats per minute (BPM).</span>
          </v-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Player',

  props: {
    track: {
      type: Object,
      default: null,
    },
    display: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    link() {
      window.open(`https://open.spotify.com/track/${this.track.id}`, '_blank');
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  position: fixed;
  width: 100vw;
  height: 120px;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  background: #222230c0;
  padding: 30px 24px;

  .song {
    display: flex;
    height: 60px;
    align-items: center;

    .image {
      display: block;
      width: 80px;
      height: 80px;
      background-size: cover;
      background-position: center center;
      margin-right: 1rem;
      animation: fadein 0.5s ease-in-out 0.5s;
      background-color: rgba(255, 255, 255, 0.055);
    }

    .details {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      max-width: 20rem;
      animation: fadein .4s;

      span {
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .title {
        font-size: 1.5rem;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }

      .title-skeleton-loader {
        display: block;
        height: 1.3rem;
        width: 15rem;
        background-color: rgba(255, 255, 255, 0.055);
      }

      .artists {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.466);
      }

      .artists-skeleton-loader {
        margin-top: 0.7rem;
        display: block;
        height: 1rem;
        width: 5rem;
        background-color: rgba(255, 255, 255, 0.055);
      }
    }
  }

  .stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100vw - 60px - 48px - 21rem - 10rem);
    padding: 0 5rem;

    &.not-display {
      .stat-column {
        .stat {
          .label {
            color: rgba(255, 255, 255, 0.267) !important;
          }
        }
      }
    }

    .stat-column {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 100%;

      .stat {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: .6rem;

        .bar {
          display: flex;
          width: 150px;
          height: .4rem;
          border-radius: 1px;
          background-color: rgba(255, 255, 255, 0.178);

          .fill {
            display: block;
            height: 100%;
            background-color: red;
            transition: width .5s ease-in-out;
          }
        }

        .label {
          margin: .1rem 0 .2rem;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.466);
          cursor: help;
        }

        &.valence {
          .label {
            color: rgb(255, 196, 1);
          }

          .bar .fill {
            background-color: rgb(255, 196, 1);
          }
        }

        &.danceability {
          .label {
            color: rgb(187, 74, 253);
          }

          .bar .fill {
            background-color: rgb(187, 74, 253);
          }
        }

        &.energy {
          .label {
            color: rgb(1, 162, 255);
          }

          .bar .fill {
            background-color: rgb(1, 162, 255);
          }
        }

        &.acousticness {
          .label {
            color: rgb(248, 91, 91);
          }

          .bar .fill {
            background-color: rgb(248, 91, 91);
          }
        }

        &.liveness {
          .label {
            color: rgb(159, 255, 121);
          }

          .bar .fill {
            background-color: rgb(159, 255, 121);
          }
        }

        &.speechiness {
          .label {
            color: rgb(255, 82, 241);
          }

          .bar .fill {
            background-color: rgb(255, 82, 241);
          }
        }

        &.instrumentalness {
          .label {
            color: rgb(65, 255, 214);
          }

          .bar .fill {
            background-color: rgb(65, 255, 214);
          }
        }

        &.tempo {
          .label {
            color: rgb(240, 124, 70);
          }

          .bar .fill {
            background-color: rgb(240, 124, 70);
          }
        }

        &.popularity {
          .label {
            color: rgb(230, 245, 100);
          }

          .bar .fill {
            background-color: rgb(230, 245, 100);
          }
        }
      }
    }
  }
}

@keyframes fadein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
