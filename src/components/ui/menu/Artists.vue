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

    <div :class="[$style.artists, {
        [$style.populated]: chosen.length > 0,
      }]"
      :style="{
        '--item-num': chosen.length,
      }">
      <list-item
        v-for="(artist, index) in chosen"
        :key="artist.id"
        :index="index"
        :image="'images' in artist && artist.images.length ? artist.images[0].url : ''"
        :name="artist.name"
        :description="`${artist.followers.total.toString().replace(/(\d)(?=(\d\d\d)+$)/, '$1,')} followers`"
        :active="true"
        @click="deselect" />
    </div>

    <div :class="[$style.artists, {
        [$style.populated]: artists.length > 0,
      }]"
      :style="{
        '--item-num': artists.length > 0 ? 3 : 0,
      }">
      <list-item
        v-for="(artist, index) in artists"
        :key="artist.id"
        :index="index"
        :image="'images' in artist && artist.images.length ? artist.images[0].url : ''"
        :name="artist.name"
        :description="`${artist.followers.total.toString().replace(/(\d)(?=(\d\d\d)+$)/, '$1,')} followers`"
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
  name: 'Artists',

  components: {
    MenuNavigation,
    ListItem,
  },

  data: () => ({
    buttonColors: BUTTON_COLORS,

    query: '',

    artists: [] as SpotifyApi.ArtistObjectSimplified[],

    chosen: [] as SpotifyApi.ArtistObjectSimplified[],
  }),

  methods: {
    ...mapActions('data', [
      'changeSettingsArtists',
      'collectData',
    ]),

    back() {
      this.changeSettingsArtists([]);
      this.$emit('select', REQUEST_TYPE.NONE);
    },

    async search() {
      if (this.query === '') {
        return;
      }
      const response = await api.spotify.artist.search(this.query);

      this.artists = (response.body.artists as SpotifyApi.PagingObject<SpotifyApi.ArtistObjectSimplified>).items;
    },

    select(index: number) {
      const artist = this.artists[index];

      if (this.chosen.includes(artist)) {
        this.chosen = this.chosen.filter((item) => item.id !== artist.id);
      } else {
        this.chosen.push(artist);
        this.artists = this.artists.filter((item) => item.id !== artist.id);
      }
    },

    deselect(index: number) {
      const artist = this.chosen[index];

      if (this.chosen.includes(artist)) {
        this.chosen = this.chosen.filter((item) => item.id !== artist.id);
      }
    },

    map() {
      this.changeSettingsArtists(this.chosen);

      this.collectData();
      this.$router.push('/exploring');
    },
  },
});
</script>

<style lang="scss" module>
.component {
  width: 400px;
  max-width: calc(100vw - 2rem);
}

.artists {
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
