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

    <div :class="[$style.albums, {
        [$style.populated]: chosen.length > 0,
      }]"
      :style="{
        '--item-num': chosen.length,
      }">
      <list-item
        v-for="(album, index) in chosen"
        :key="album.id"
        :index="index"
        :image="album.images[0].url"
        :name="album.name"
        :description="album.artists.map(artist => artist.name).join(', ')"
        :active="true"
        @click="deselect" />
    </div>

    <div :class="[$style.albums, {
        [$style.populated]: albums.length > 0,
      }]"
      :style="{
        '--item-num': albums.length > 0 ? 3 : 0,
      }">
      <list-item
        v-for="(album, index) in albums"
        :key="album.id"
        :index="index"
        :image="album.images[0].url"
        :name="album.name"
        :description="album.artists.map(artist => artist.name).join(', ')"
        @click="select" />
    </div>

    <div :class="$style.actions">
      <menu-navigation
        :disableMap="chosen.length === 0"
        @back="back"
        @map="map" />
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
import ListItem from '../list/ListItem.vue';

export default Vue.extend({
  name: 'Albums',

  components: {
    MenuNavigation,
    ListItem,
  },

  data: () => ({
    buttonColors: BUTTON_COLORS,

    query: '',

    albums: [] as SpotifyApi.AlbumObjectSimplified[],

    chosen: [] as SpotifyApi.AlbumObjectSimplified[],
  }),

  methods: {
    ...mapActions('data', [
      'changeSettingsAlbums',
    ]),

    back() {
      this.changeSettingsAlbums([]);
      this.$emit('select', REQUEST_TYPE.NONE);
    },

    async search() {
      if (this.query === '') {
        return;
      }
      const response = await api.spotify.album.search(this.query);

      this.albums = (response.body.albums as SpotifyApi.PagingObject<SpotifyApi.AlbumObjectSimplified>).items;
    },

    select(index: number) {
      const album = this.albums[index];

      if (this.chosen.includes(album)) {
        this.chosen = this.chosen.filter((item) => item.id !== album.id);
      } else {
        this.chosen.push(album);
        this.albums = this.albums.filter((item) => item.id !== album.id);
      }
    },

    deselect(index: number) {
      const album = this.chosen[index];

      if (this.chosen.includes(album)) {
        this.chosen = this.chosen.filter((item) => item.id !== album.id);
      }
    },

    map() {
      this.changeSettingsAlbums(this.chosen);
    },
  },
});
</script>

<style lang="scss" module>
.component {
  width: 400px;
  max-width: calc(100vw - 2rem);
}

.albums {
  --item-num: 0;

  overflow: auto;

  &.populated {
    height: calc((66px + 16px) * var(--item-num));
    padding: 0 .5rem 0 0;

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
}

.actions {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
