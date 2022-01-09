<template>
  <div :class="$style.component">
    <div id="container" />
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';
import {
  Camera,
  Mesh,
  Scene,
  WebGLRenderer,
} from 'three';
import {
  addAmbientLightToScene,
  addDirectionLightToScene,
  addPointMeshToScene,
  applyFog,
  createOrthographicCamera,
  createRenderer,
  createScene,
  getContainer,
} from '@/helpers/three';
import { Track } from '@/helpers/spotify';

interface IData {
  showTitle: boolean;
  start: number;
  lastUpdate: number;
  messageIndex: number;
  messages: string[];
  camera: null | Camera;
  scene: null | Scene;
  renderer: null | WebGLRenderer;
  points: Mesh[];
}

interface IComputed {
  isAuthenticated: boolean;
  getProgress: number;
  getProgressSample: Track[];
  isDone: boolean;
  progressUpdate: string;
  message: string;
}

interface IMethods {
  generateRandomPoints: () => void;
  initialize: () => void;
  animate: () => void;
}

export default Vue.extend<IData, IMethods, IComputed>({
  name: 'Exploring',

  data: () => ({
    showTitle: true,
    start: 0,
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
    camera: null as Camera | null,
    scene: null as Scene | null,
    renderer: null as WebGLRenderer | null,
    points: [] as Mesh[],
  }),

  methods: {
    generateRandomPoints() {
      const xRandom = 2.4;
      const yRandom = 1.4;
      const zRandom = 10;
      const zMin = -10;

      for (let i = 0; i < 50; i += 1) {
        this.points.push(addPointMeshToScene(
          this.scene as Scene,
          Math.random() * xRandom - (xRandom / 2),
          Math.random() * yRandom - (yRandom / 2),
          Math.random() * zRandom - (zRandom / 2) + zMin,
        ));
      }
    },

    initialize() {
      const container = (getContainer() as HTMLElement);
      this.camera = createOrthographicCamera(container);
      this.scene = createScene();
      applyFog(this.scene);
      this.generateRandomPoints();

      addDirectionLightToScene(this.scene);
      addAmbientLightToScene(this.scene);

      this.renderer = createRenderer(container);

      this.animate();
    },

    animate() {
      requestAnimationFrame(this.animate);

      for (let i = 0; i < this.points.length; i += 1) {
        const point = this.points[i];
        point.rotation.x += Math.random() * 0.04;
        point.rotation.y += Math.random() * 0.04;
        point.position.x += Math.sin((this.start - Date.now()) / 1000 + i) / 5000;
        point.position.y += Math.sin((this.start - Date.now()) / 1000 + i) / 5000;
      }

      // eslint-disable-next-line max-len
      (this.renderer as WebGLRenderer).render((this.scene as Scene), this.camera as Camera);
    },
  },

  computed: {
    ...mapGetters('auth', [
      'isAuthenticated',
    ]),
    ...mapGetters('data', [
      'getProgress',
      'getProgressSample',
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
      this.start = Date.now();
      this.lastUpdate = Date.now();
      this.messages = this.messages.sort(() => Math.random() - 0.5);
      this.$store.dispatch('data/collectData');
    }
  },

  async mounted() {
    await this.initialize();
    this.animate();
  },

  watch: {
    progressUpdate() {
      if (this.getProgress >= 1 || this.isDone) {
        this.$router.push('/cartography');
      }
      if (Date.now() - this.lastUpdate > 5000) {
        this.showTitle = false;
        this.lastUpdate = Date.now();
        this.messageIndex += 1;
        this.messageIndex %= this.messages.length;
        this.showTitle = true;
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
