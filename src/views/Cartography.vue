<template>
  <div :class="$style.component">
    <div
      :class="$style.container"
      id="container"
      @click.ctrl="handleClick" />

    <span :class="$style['frame-rate']">
      {{ framesPerSeconds }} FPS
    </span>

    <progress-details />

    <player
      :display="(hovered !== -1 || playing !== -1) && getTracks[hovered !== -1 ? hovered : playing] !== undefined"
      :track="hovered !== -1 || playing !== -1 ? getTracks[hovered !== -1 ? hovered : playing] : null" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import {
  PerspectiveCamera,
  Scene,
  Mesh,
  WebGLRenderer,
  Vector2,
  Raycaster,
  sRGBEncoding,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {
  addAmbientLightToScene,
  addPointLightToScene,
  addPointMeshToScene,
  createOrbitControls,
  createPerspectiveCamera,
  createRenderer,
  createScene,
  getContainer,
} from '@/helpers/three';
import { getColor } from '@/helpers/colors';
import Player from '@/components/Player.vue';
import ProgressDetails from '@/components/ProgressDetails.vue';
import { Track } from '@/helpers/spotify-processing';

interface IData {
  camera: PerspectiveCamera | null;
  scene: Scene | null;
  renderer: WebGLRenderer | null;
  controls: OrbitControls | null;
  mouse: Vector2;
  points: Mesh[];
  raycaster: Raycaster | null;
  hovered: number;
  playing: number;
  lastFrame: number;
  framesPerSeconds: number;
}

interface IComputed {
  getTracks: Array<Track>;
  getGraph: Array<Array<number>>;
  getFirstAndLast: Array<number>;
  isProcessDone: boolean;
  isAuthenticated: boolean;
  timeToReset: number;
  getUpdate: number;
}

interface IMethods {
  processData: () => void;
  handleClick: () => void;
  addPoints: () => void;
  trackMouse: (e: MouseEvent) => void;
  initialize: () => void;
  animate: () => void;
  resize: () => void;
}

export default Vue.extend<IData, IMethods, IComputed>({
  name: 'Cartography',

  components: {
    Player,
    ProgressDetails,
  },

  data: () => ({
    camera: null as PerspectiveCamera | null,
    scene: null as Scene | null,
    renderer: null as WebGLRenderer | null,
    controls: null as OrbitControls | null,
    mouse: new Vector2(0, 0),
    points: [] as Mesh[],
    raycaster: null as Raycaster | null,
    hovered: -1 as number,
    playing: -1 as number,
    lastFrame: Date.now() as number,
    framesPerSeconds: 0 as number,
  }),

  computed: {
    ...mapGetters('data', [
      'getTracks',
      'getFirstAndLast',
    ]),

    ...mapGetters('map', [
      'getGraph',
      'isProcessDone',
      'getUpdate',
    ]),

    ...mapGetters('auth', [
      'isAuthenticated',
    ]),

    timeToReset() {
      return this.getUpdate;
    },
  },

  async mounted() {
    if (!this.isAuthenticated && this.getTracks.length === 0) {
      this.$router.push('/');
    }
    if (this.getTracks.length === 0) {
      this.$router.push('/explore');
    }

    if (this.isAuthenticated) {
      await this.$store.dispatch('map/firstProcess');
    }

    await this.initialize();
    this.animate();

    window.addEventListener('resize', this.resize);
    window.addEventListener('mousemove', this.trackMouse);
  },

  watch: {
    timeToReset() {
      if (this.isProcessDone) {
        this.addPoints();
      }
    },
  },

  methods: {
    ...mapActions('map', [
      'processData',
    ]),

    handleClick() {
      if (this.hovered !== -1) {
        if (this.isAuthenticated) {
          this.$store.dispatch('player/play', this.getTracks[this.hovered].id);
          this.playing = this.hovered;
        }
      }
    },

    addPoints() {
      if (!this.getGraph.length || this.renderer === null) {
        return;
      }

      // Remove all old points.
      for (let i = 0; i < this.points.length; i += 1) {
        (this.scene as Scene).remove(this.points[i]);
      }

      this.points = [];

      const firstAndLast = this.getFirstAndLast as number[];
      const first = firstAndLast[0];
      const last = firstAndLast[1];

      let largestValue = 0;

      for (let i = 0; i < this.getGraph.length; i += 1) {
        for (let j = 0; j < this.getGraph[i].length; j += 1) {
          if (this.getGraph[i][j] > largestValue) {
            largestValue = this.getGraph[i][j];
          }
        }
      }

      const multiplier = 1;

      // Add new points.
      for (let i = 0; i < this.getGraph.length; i += 1) {
        if (this.getTracks[i] !== undefined) {
          let color = getColor(1.0);
          if ('added' in this.getTracks[i]) {
            color = getColor((this.getTracks[i].added - first) / (last - first));
          }
          this.points.push(addPointMeshToScene(
            this.scene as Scene,
            (this.getGraph[i][0] / largestValue) * multiplier,
            (this.getGraph[i][1] / largestValue) * multiplier,
            (this.getGraph[i][2] / largestValue) * multiplier,
            color,
          ));
        }
      }
    },

    trackMouse(e: MouseEvent) {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },

    async initialize() {
      const container = (getContainer() as HTMLElement);
      this.raycaster = new Raycaster();
      this.camera = createPerspectiveCamera(container);
      this.scene = createScene();
      this.controls = createOrbitControls(this.camera, container);

      addPointLightToScene(this.scene);
      addAmbientLightToScene(this.scene);

      this.renderer = createRenderer(container);
      this.renderer.outputEncoding = sRGBEncoding;

      if (this.getGraph.length && !this.points.length) {
        this.addPoints();
      }
    },

    animate() {
      requestAnimationFrame(this.animate);

      const now = Date.now();
      const milliseconds = now - this.lastFrame;
      this.framesPerSeconds = Math.floor(1000 / milliseconds);
      this.lastFrame = now;

      (this.raycaster as Raycaster).setFromCamera(this.mouse, this.camera as PerspectiveCamera);
      const intersections = (this.raycaster as Raycaster).intersectObjects(this.points);

      if (intersections.length) {
        const { uuid } = intersections[0].object;

        for (let i = 0; i < this.points.length; i += 1) {
          if (this.points[i].uuid === uuid) {
            this.hovered = i;
            break;
          }
        }
      } else {
        this.hovered = -1;
      }

      if (this.isProcessDone) {
        for (let i = 0; i < this.points.length; i += 1) {
          if (this.getTracks[i] && 'audioFeatures' in this.getTracks[i]) {
            this.points[i].rotation.y += this.getTracks[i].audioFeatures.energy / 10;
          }
        }
      }

      // eslint-disable-next-line max-len
      (this.renderer as WebGLRenderer).render((this.scene as Scene), (this.camera as PerspectiveCamera));
    },

    resize() {
      const container = document.getElementById('container') as HTMLElement;

      (this.renderer as WebGLRenderer).setSize(container.clientWidth, container.clientHeight);
    },
  },
});
</script>

<style lang="scss" module>
.container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: block;
}

.frame-rate {
  position: absolute;
  top: 0;
  right: 1rem;
  font-size: 1rem;
  color: #fff;
}

.player {
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
      }

      .artists {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.466);
      }
    }
  }

  .stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: calc(100vw - 60px - 48px - 21rem);
    padding: 0 5rem;

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

        .bar {
          display: flex;
          width: 150px;
          height: .2rem;
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
