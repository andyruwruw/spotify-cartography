<template>
  <div id="container" />
</template>

<script lang="ts">
import Vue from 'vue';
import {
  Camera,
  Mesh,
  Raycaster,
  Scene,
  Vector2,
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

const SPAWNING_X_RANDOM_DRIFT = 2.4;
const SPAWNING_Y_RANDOM_DRIFT = 1.4;
const SPAWNING_Z_RANDOM_DRIFT = 10;
const SPAWNING_Z_MINIMUM = -10;

export default Vue.extend({
  name: 'FloatingBackground',

  data: () => ({
    camera: null as Camera | null,
    scene: null as Scene | null,
    renderer: null as WebGLRenderer | null,
    mouse: new Vector2(0, 0),
    points: [] as Mesh[],
    start: 0 as number,
  }),

  async mounted() {
    window.addEventListener('mousemove', this.trackMouse);

    this.start = Date.now();

    await this.initialize();
    this.animate();
  },

  methods: {
    trackMouse(e: MouseEvent) {
      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },

    async initialize() {
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

    generateRandomPoints() {
      for (let i = 0; i < 100; i += 1) {
        this.points.push(addPointMeshToScene(
          this.scene as Scene,
          Math.random() * SPAWNING_X_RANDOM_DRIFT - (SPAWNING_X_RANDOM_DRIFT / 2),
          Math.random() * SPAWNING_Y_RANDOM_DRIFT - (SPAWNING_Y_RANDOM_DRIFT / 2),
          Math.random() * SPAWNING_Z_RANDOM_DRIFT - (SPAWNING_Z_RANDOM_DRIFT / 2) + SPAWNING_Z_MINIMUM,
        ));
      }
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
});
</script>

<style lang="sss" module>
</style>