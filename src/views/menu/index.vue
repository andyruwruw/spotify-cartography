<template>
  <div :class="$style.component">
    <div :class="$style.content">
      <span :class="$style.welcome">
        {{ welcomeMessage }}
      </span>

      <span :class="$style.prompt">
        {{ promptMessage}}
      </span>

      <main-menu
        v-if="tab === requestTypes.NONE"
        :tab="tab"
        @select="selectTab" />

      <albums
        v-if="tab === requestTypes.ALBUMS"
        @select="selectTab" />

      <artists
        v-if="tab === requestTypes.ARTISTS"
        @select="selectTab" />

      <liked-tracks
        v-if="tab === requestTypes.LIKED_SONGS"
        @select="selectTab" />

      <playlists
        v-if="tab === requestTypes.PLAYLISTS"
        @select="selectTab" />

      <top-listened
        v-if="tab === requestTypes.TOP_LISTENED"
        @select="selectTab" />
    </div>

    <floating-background />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  mapActions,
  mapGetters,
} from 'vuex';

import { REQUEST_TYPE } from '@/config';
import FloatingBackground from '@/components/ui/background/floating-background.vue';

import MainMenu from './components/pages/main-menu.vue';
import Albums from './components/pages/albums.vue';
import Artists from './components/pages/artists.vue';
import LikedTracks from './components/pages/liked-tracks.vue';
import Playlists from './components/pages/playlists.vue';
import TopListened from './components/pages/top-listened.vue';
import { BUTTON_COLORS } from './config';

interface IData {
  tab: string;
  buttonColors: Record<string, string>;
}

interface IComputed {
  getDisplayName: string;
  isAuthenticated: boolean;
  welcomeMessage: string;
  promptMessage: string;
}

interface IMethods {
  changeSettingsType: (type: string) => void;
  selectTab: (tab: string) => void;
}

export default Vue.extend<IData, IMethods, IComputed>({
  name: 'Menu',

  components: {
    Albums,
    Artists,
    FloatingBackground,
    LikedTracks,
    MainMenu,
    Playlists,
    TopListened,
  },

  data: () => ({
    tab: REQUEST_TYPE.NONE,
    requestTypes: REQUEST_TYPE,
    buttonColors: BUTTON_COLORS,
  }),

  computed: {
    ...mapGetters('auth', [
      'getDisplayName',
      'isAuthenticated',
    ]),

    welcomeMessage() {
      return `Welcome ${this.getDisplayName}`;
    },

    promptMessage() {
      switch (this.tab) {
        case REQUEST_TYPE.NONE:
          return 'What would you like to map?';
        case REQUEST_TYPE.LIKED_SONGS:
          return 'Do these settings look good to you?';
        case REQUEST_TYPE.PLAYLISTS:
          return 'Select one or more playlists then let\'s go!';
        case REQUEST_TYPE.ALBUMS:
          return 'What album or albums would you like to map?';
        case REQUEST_TYPE.ARTISTS:
          return 'Who\'s getting mapped today?';
        case REQUEST_TYPE.TOP_LISTENED:
          return 'What time period should we explore?';
        default:
          return 'I\'m broken, please help.';
      }
    },
  },

  created() {
    if (!this.isAuthenticated) {
      this.$router.push('/');
    }
  },

  methods: {
    ...mapActions('data', [
      'changeSettingsType',
    ]),

    selectTab(key: string) {
      if (key === this.tab) {
        this.changeSettingsType(REQUEST_TYPE.NONE);
        this.tab = REQUEST_TYPE.NONE;
      } else {
        this.changeSettingsType(key);
        this.tab = key;
      }
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-bottom: 15vh;

  .content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;

    .welcome {
      width: 100%;
      text-align: center;
      font-size: 1.2rem;
      margin-bottom: .8rem;
      font-weight: 200;
      color: rgba(255, 255, 255, 0.274);
    }

    .prompt {
      color: white;
      font-size: 1.5rem;
      margin-bottom: 2rem;
      font-weight: 300;
    }
  }
}

.action {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 1rem;
}
</style>
