<template>
  <div>
    <div
      :class="$style.container"
      id="container" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  PerspectiveCamera,
  Scene,
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  WebGLRenderer,
} from 'three';

export default Vue.extend({
  name: 'Cartography',

  data: () => ({
    camera: null as PerspectiveCamera | null,
    scene: null as Scene | null,
    renderer: null as WebGLRenderer | null,
    mesh: null as Mesh | null,
  }),

  methods: {
    initialize() {
      const container = document.getElementById('container') as HTMLElement;

      this.camera = new PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.01,
        10,
      );
      (this.camera as PerspectiveCamera).position.z = 1;

      this.scene = new Scene();

      const geometry = new BoxGeometry(0.2, 0.2, 0.2);
      const material = new MeshNormalMaterial();

      this.mesh = new Mesh(geometry, material);
      (this.scene as Scene).add(this.mesh);

      this.renderer = new WebGLRenderer({ antialias: true });
      (this.renderer as WebGLRenderer).setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
    },
    animate() {
      requestAnimationFrame(this.animate);
      (this.mesh as Mesh).rotation.x += 0.01;
      (this.mesh as Mesh).rotation.y += 0.02;
      // eslint-disable-next-line max-len
      (this.renderer as WebGLRenderer).render((this.scene as Scene), (this.camera as PerspectiveCamera));
    },
  },

  mounted() {
    this.initialize();
    this.animate();
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
