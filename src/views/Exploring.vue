<template>
  <div :class="$style.component">
    <div :class="$style.content">
      <h1 v-if="showTitle">
        {{ message }}
      </h1>

      <div :class="$style['progress-bar']">
        <div
          :class="$style['bar']"
          :style="{
            'width': (getProgress * 100) + '%',
          }" />
      </div>
    </div>

    <floating-background />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

import FloatingBackground from '@/components/ui/FloatingBackground.vue';

interface IData {
  lastUpdate: number;
  messageIndex: number;
  messages: string[];
}

interface IComputed {
  isAuthenticated: boolean;
  getProgress: number;
  isDone: boolean;
  progressUpdate: string;
  message: string;
}

export default Vue.extend<IData, Record<string, unknown>, IComputed>({
  name: 'Exploring',

  components: {
    FloatingBackground,
  },

  data: () => ({
    lastUpdate: 0,

    messageIndex: 0,

    messages: [
      'please wait while the little elves draw your map',
      'powered by a lemon and two electrodes',
      'we\'re testing your patience',
      'following the white rabbit',
      'why don\'t you order a sandwich?',
      'the bits are flowing slowly today',
      'dig on the x for buried treasure',
      'my other loading screen is much faster',
      'insert quarter',
      'are we there yet?',
      'just count to ten',
      'counting backwards from infinity',
      'waiting for the cows to cross the road',
      'time flies when you’re having fun',
      'convincing ai not to turn evil',
      'twiddling thumbs',
    ],
  }),

  computed: {
    ...mapGetters('auth', [
      'isAuthenticated',
    ]),

    ...mapGetters('data', [
      'getProgress',
      'isDone',
    ]),

    progressUpdate() {
      return `${Math.round(this.getProgress * 100)}%`;
    },

    message() {
      return this.messages[this.messageIndex];
    },
  },

  created() {
    if (!this.isAuthenticated) {
      this.$router.push('/');
    } else {
      this.lastUpdate = Date.now();
      this.messages = this.messages.sort(() => Math.random() - 0.5);
      this.$store.dispatch('data/collectData');
    }
  },

  watch: {
    progressUpdate() {
      if (this.getProgress >= 1 || this.isDone) {
        this.$router.push('/cartography');
      }
      if (Date.now() - this.lastUpdate > 5000) {
        this.lastUpdate = Date.now();
        this.messageIndex += 1;
        this.messageIndex %= this.messages.length;
      }
    },

    isDone() {
      if (this.isDone) {
        this.$router.push('/cartography');
      }
    },
  },
});
</script>

<style lang="scss" module>
.component {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: calc(100vh - 180px);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #222230c7;
  border: 1px solid rgba(255, 255, 255, 0.103);
  padding: 3rem;
  border-radius: 1rem;
  animation: fadeIn 1s;
  width: 50rem;
  min-width: 32vw;
  max-width: calc(100% - 4rem);
  margin: 2rem;
  z-index: 100;

  h1 {
    font-size: 2rem;
    font-weight: 300;
    margin-bottom: 2rem;
    animation: fadeIn .5s;
    color: #14A5AE;
  }
}

.samples {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  .image {
    display: block;
    width: 8vw;
    height: 8vw;
    background-size: 100% auto;
    background-position: center center;
    animation: fadeIn 0.5s ease-in-out;
  }
}

.progress-bar {
  display: flex;
  width: 100%;
  height: .25rem;
  background: rgba(255, 255, 255, 0.027);
  border-radius: .3rem;

  .bar {
    display: block;
    height: 100%;
    background: #14A5AE;
    border-radius: .3rem;
    transition: width .3s ease-in-out;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
