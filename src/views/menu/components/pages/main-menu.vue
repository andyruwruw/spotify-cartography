<template>
  <div :class="$style.component">
    <div
      v-for="button in buttons"
      :key="button.key"
      :class="$style['button-wrapper']">
      <v-btn
        text
        dark
        large
        block
        :class="$style.button"
        style="margin-bottom: 1rem"
        :color="button.color"
        @click="select(button.key)">
        <v-icon style="margin-right: .5rem">{{ button.icon }}</v-icon>
        {{ button.label }}
      </v-btn>
    </div>

    <div :class="$style['button-wrapper']">
      <samples-dialog button="secondary" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { REQUEST_TYPE } from '@/config';
import SamplesDialog from '@/components/ui/dialogs/samples-dialog/samples-dialog.vue';

import { BUTTON_COLORS } from '../../config';

export default Vue.extend({
  name: 'MainMenu',

  components: {
    SamplesDialog,
  },

  props: {
    tab: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    buttons: [
      {
        label: 'Your Top Listened',
        color: BUTTON_COLORS.yellow,
        key: REQUEST_TYPE.TOP_LISTENED,
        icon: 'mdi-poll',
      },
      {
        label: 'Liked Songs',
        color: BUTTON_COLORS.blue,
        key: REQUEST_TYPE.LIKED_SONGS,
        icon: 'mdi-heart',
      },
      {
        label: 'Playlists',
        color: BUTTON_COLORS.purple,
        key: REQUEST_TYPE.PLAYLISTS,
        icon: 'mdi-playlist-music-outline',
      },
      {
        label: 'Albums',
        color: BUTTON_COLORS.green,
        key: REQUEST_TYPE.ALBUMS,
        icon: 'mdi-album',
      },
      {
        label: 'Artists',
        color: BUTTON_COLORS.red,
        key: REQUEST_TYPE.ARTISTS,
        icon: 'mdi-account',
      },
    ],
  }),

  methods: {
    select(key: string) {
      this.$emit('select', key);
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  flex-direction: column;
}

.button-wrapper {
  width: 100%;
}

.button {
  justify-content: left;
}
</style>
