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
        [$style.populated]: chosen.length > 0,
      }]"
      :style="{
        '--item-num': chosen.length,
      }">
      <list-item
        v-for="(playlist, index) in chosen"
        :key="playlist.id"
        :index="index"
        :image="'images' in playlist && playlist.images.length ? playlist.images[0].url : ''"
        :name="playlist.name"
        :description="playlist.owner.display_name"
        :active="true"
        @click="deselect" />
    </div>

    <div :class="[$style.playlists, {
        [$style.populated]: playlists.length > 0,
      }]"
      :style="{
        '--item-num': playlists.length > 0 ? 3 : 0,
      }">
      <list-item
        v-for="(playlist, index) in playlists"
        :key="playlist.id"
        :index="index"
        :image="'images' in playlist && playlist.images.length ? playlist.images[0].url : ''"
        :name="playlist.name"
        :description="playlist.owner.display_name"
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
import ListItem from '@/components/ui/list/list-item.vue';
import { BUTTON_COLORS } from '../../config';
import MenuNavigation from '../shared/menu-navigation.vue';

export default Vue.extend({
  name: 'Playlists',

  components: {
    MenuNavigation,
    ListItem,
  },

  data: () => ({
    buttonColors: BUTTON_COLORS,

    query: '',

    playlists: [] as SpotifyApi.PlaylistObjectSimplified[],

    chosen: [] as SpotifyApi.PlaylistObjectSimplified[],
  }),

  methods: {
    ...mapActions('data', [
      'changeSettingsPlaylists',
      'collectData',
    ]),

    back() {
      this.changeSettingsPlaylists([]);
      this.$emit('select', REQUEST_TYPE.NONE);
    },

    async search() {
      if (this.query === '') {
        return;
      }
      const response = await api.spotify.playlist.search(this.query);

      this.playlists = (response.body.playlists as SpotifyApi.PagingObject<SpotifyApi.PlaylistObjectSimplified>).items;
    },

    select(index: number) {
      const playlist = this.playlists[index];

      if (this.chosen.includes(playlist)) {
        this.chosen = this.chosen.filter((item) => item.id !== playlist.id);
      } else {
        this.chosen.push(playlist);
        this.playlists = this.playlists.filter((item) => item.id !== playlist.id);
      }
    },

    deselect(index: number) {
      const playlist = this.chosen[index];

      if (this.chosen.includes(playlist)) {
        this.chosen = this.chosen.filter((item) => item.id !== playlist.id);
      }
    },

    map() {
      this.changeSettingsPlaylists(this.chosen);

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

.playlists {
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
