<template>
  <div>
    <div
      :class="$style.container"
      id="container" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapActions } from 'vuex';
import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  WebGLRenderer,
  TextureLoader,
  SphereGeometry,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import {
  createSkyBoxMesh,
} from '@/helpers/skybox';
import { Track } from '@/helpers/spotify';

export default Vue.extend({
  name: 'Cartography',

  data: () => ({
    camera: null as PerspectiveCamera | null,
    scene: null as Scene | null,
    renderer: null as WebGLRenderer | null,
    controls: null as OrbitControls | null,
    mesh: null as Mesh | null,
  }),

  computed: {
    ...mapGetters('data', [
      'getTracks',
      'getGraph',
    ]),
  },

  mounted() {
    this.initialize();
    this.animate();

    window.addEventListener('resize', this.resize);
  },

  methods: {
    ...mapActions('data', [
      'processData',
    ]),

    initialize() {
      const container = document.getElementById('container') as HTMLElement;

      this.createCamera(container);

      this.createControls(container);

      this.createScene();

      this.createSkyBox();

      this.plotSpheres();

      // const geometry = new BoxGeometry(0.2, 0.2, 0.2);
      // const material = new MeshNormalMaterial();

      // this.mesh = new Mesh(geometry, material);
      // (this.scene as Scene).add(this.mesh);

      this.renderer = new WebGLRenderer({ antialias: true });
      (this.renderer as WebGLRenderer).setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
    },

    createCamera(container: HTMLElement) {
      this.camera = new PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.01,
        10000,
      );
      (this.camera as PerspectiveCamera).position.z = 1;
    },

    createControls(container: HTMLElement) {
      this.controls = new OrbitControls(
        this.camera as PerspectiveCamera,
        container,
      );
      this.controls.maxDistance = 100;
      this.controls.minDistance = 1;
    },

    createScene() {
      this.scene = new Scene();
    },

    createSkyBox() {
      const skybox = createSkyBoxMesh();
      (this.scene as Scene).add(skybox);
    },

    plotSpheres() {
      const tracks: Array<Track> = Object.values(this.getTracks);

      for (let i = 0; i < tracks.length; i += 1) {
        const geometry = new SphereGeometry(
          0.2,
          5,
          2,
        );
        const material = new MeshNormalMaterial();
        const mesh = new Mesh(geometry, material);
        mesh.position.x = tracks[i].audioFeatures.acousticness * 100;
        mesh.position.y = tracks[i].audioFeatures.danceability * 100;
        mesh.position.z = tracks[i].audioFeatures.valence * 100;
        (this.scene as Scene).add(mesh);
      }
    },

    animate() {
      requestAnimationFrame(this.animate);
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
</style>
