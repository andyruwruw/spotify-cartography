<template>
  <div id="container" />
</template>

<script lang="ts">
import Vue from 'vue';
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

/**
 * Dictates how large the spawning zone should be in proportion to canvas size.
 */
const PIXEL_TO_CANVAS_RATIO = 0.001;

/**
 * Amount of distance points can differentiate on the z-axis.
 */
const SPAWNING_Z_RANDOM_DRIFT = 10;

/**
 * Minimum distance away points spawn away from the origin.
 */
const SPAWNING_Z_MINIMUM = -10;

/**
 * Number of points in proportion to canvas size.
 */
const POINT_DENSITY = 0.00002;

export default Vue.extend({
  name: 'FloatingBackground',

  data: () => ({
    /**
     * Three.js camera object.
     */
    camera: null as Camera | null,

    /**
     * Three.js scene.
     */
    scene: null as Scene | null,

    /**
     * Three.js scene renderer.
     */
    renderer: null as WebGLRenderer | null,

    /**
     * Array of point Mesh objects.
     */
    points: [] as Mesh[],

    /**
     * Start time, used to calculate point placements.
     */
    start: 0 as number,
  }),

  async mounted() {
    this.start = Date.now();

    await this.initialize();
    this.animate();
  },

  methods: {
    /**
     * Initializes the Three.js scene.
     */
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

    /**
     * Creates a random set of points based on canvas size.
     */
    generateRandomPoints() {
      const spawnWidth = window.innerWidth * PIXEL_TO_CANVAS_RATIO;
      const spawnheight = window.innerHeight * PIXEL_TO_CANVAS_RATIO;

      const numPoints = Math.round(window.innerWidth * window.innerHeight * POINT_DENSITY);

      for (let i = 0; i < numPoints; i += 1) {
        this.points.push(addPointMeshToScene(
          this.scene as Scene,
          Math.random() * spawnWidth - (spawnWidth / 2),
          Math.random() * spawnheight - (spawnheight / 2),
          Math.random() * SPAWNING_Z_RANDOM_DRIFT - (SPAWNING_Z_RANDOM_DRIFT / 2) + SPAWNING_Z_MINIMUM,
        ));
      }
    },

    /**
     * Animates the scene.
     */
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
