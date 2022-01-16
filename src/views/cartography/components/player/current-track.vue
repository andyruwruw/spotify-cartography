<template>
  <div :class="$style.component">
    <div
      :class="$style.image"
      :style="{
        'background-image': `url('${image}')`,
      }" />

    <div :class="$style.details">
      <span
        v-if="dataAvailable"
        :class="$style.title"
        @click="link">
        {{ track.name }}
      </span>

      <span
        v-if="!dataAvailable"
        :class="$style['title-skeleton-loader']" />

      <span
        v-if="dataAvailable"
        :class="$style.artists">
        {{ track.artist }}
      </span>

      <span
        v-if="!dataAvailable"
        :class="$style['artists-skeleton-loader']" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { Track } from '@/config';

interface IMethods {
  link: () => void;
}

interface IComputed {
  dataAvailable: boolean;
  image: string;
}

interface IProps {
  track: Track | null;
}

export default Vue.extend<Record<string, unknown>, IMethods, IComputed, IProps>({
  name: 'CurrentTrack',

  props: {
    track: {
      type: Object,
      default: null,
    },
  },

  computed: {
    dataAvailable(): boolean {
      return this.track !== null;
    },

    image(): string {
      if (this.dataAvailable) {
        return (this.track as Track).image;
      }

      return '#';
    },
  },

  methods: {
    link(): void {
      window.open(`https://open.spotify.com/track/${(this.track as Track).id}`, '_blank');
    },
  },
});
</script>

<style lang="scss" module>
.component {
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
    animation: fade-in 0.5s ease-in-out 0.5s;
    background-color: rgba(255, 255, 255, 0.055);
  }

  .details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    max-width: 20rem;
    animation: fade-in .4s;

    span {
      max-width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .title {
      font-size: 1.5rem;
      cursor: pointer;
      animation: fade-in .5s ease-in-out;

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
      animation: fade-in .5s ease-in-out;
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
</style>
