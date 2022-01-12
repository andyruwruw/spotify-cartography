<template>
  <div :class="$style.component">
    <v-text-field
      v-model="query"
      :color="buttonColors.yellow"
      placeholder="Search..."
      outlined
      dark
      full-width
      @keydown="search" />

    <div :class="[$style.playlists, {
      [$style.populated]: playlists.length > 0,
    }]">
      <div
        v-for="playlist in playlists"
        :key="playlist.id"
        :class="$style.playlist">
        <div
          :class="$style.image"
          :style="{
            'background-image': `url(${playlist.images[0].url})`,
          }" />

        <div :class="$style.details">
          <span :class="$style.name">
            {{ playlist.name }}
          </span>

          <span :class="$style.owner">
            {{ playlist.owner.display_name }}
          </span>
        </div>
      </div>
    </div>

    <div :class="$style.actions">
      <menu-navigation
        :disableMap="false"
        @back="back" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import SpotifyApi from 'spotify-web-api-node';

import api from '@/api';
import { REQUEST_TYPE } from '@/config';
import { BUTTON_COLORS } from './config';
import MenuNavigation from './MenuNavigation.vue';

export default Vue.extend({
  name: 'Playlists',

  components: {
    MenuNavigation,
  },

  data: () => ({
    buttonColors: BUTTON_COLORS,

    query: '',

    playlists: [] as SpotifyApi.PlaylistObjectSimplified[],
  }),

  methods: {
    ...mapActions('data', [
      'changeSettingsTimeRange',
    ]),

    back() {
      this.changeSettingsTimeRange('');
      this.$emit('select', REQUEST_TYPE.NONE);
    },

    async search() {
      const response = await api.spotify.playlist.search(this.query);

      this.playlists = (response.body.playlists as SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectSimplified>).items;
    },
  },
});
</script>

<style lang="scss" module>
.component {
  width: 400px;
  max-width: calc(100vw - 2rem);
}

.playlists.populated {
  height: calc((66px + 16px) * 5);
  overflow: auto;
  border: 1px solid #e0e0e0;

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

.playlist {
  display: flex;
  width: 100%;
  margin: 0 0 1rem;
  border: 1px solid rgba(255, 255, 255, 0);
  padding: .5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: border .2s ease;

  &:hover {
    border: 1px solid rgb(240, 124, 70);
  }
}

.image {
  display: block;
  width: 3rem;
  height: 3rem;
  background-size: auto 100%;
  background-position: center center;
  background-color: #222;
  margin-right: .8rem;
}

.details {
  display: flex;
  flex-direction: column;
  width: calc(100% - 3rem - .8rem - 1rem);

  .name {
    color: white;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    min-width: 0;
    max-width: 100%;
  }

  .owner {
    color: rgba(255, 255, 255, 0.52);
    font-weight: 200;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
