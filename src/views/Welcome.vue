<template>
  <div :class="$style.component">
    <div
      id="container"
      :class="[
        $style.container,
        {
          [$style.hovering]: hoverLogin || hoverExample,
        },
      ]"
      @click="handleClick" />

    <samples v-if="samplesMenu" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import {
  Camera,
  Line,
  Mesh,
  MeshPhysicalMaterial,
  OrthographicCamera,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';

import {
  getContainer,
  createOrthographicCamera,
  createScene,
  createRenderer,
  applyFog,
  addTextMeshToScene,
  addDirectionLightToScene,
  addAmbientLightToScene,
  addPointMeshToScene,
} from '@/helpers/three';
import Samples from '@/components/Samples.vue';

export default Vue.extend({
  name: 'Welcome',

  components: {
    Samples,
  },

  data: () => ({
    camera: null as Camera | null,
    scene: null as Scene | null,
    renderer: null as WebGLRenderer | null,
    title: null as Mesh | null,
    loginButton: null as Mesh | null,
    exampleButton: null as Mesh | null,
    mouse: new Vector2(0, 0),
    mouseNormal: new Vector2(0, 0),
    line: null as Line | null,
    raycaster: null as Raycaster | null,
    hoverLogin: false,
    hoverExample: false,
    points: [] as Mesh[],
    start: 0 as number,
    samplesMenu: false,
  }),

  methods: {
    ...mapActions('data', [
      'loadExampleData',
    ]),

    trackMouse(e: MouseEvent) {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouseNormal.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNormal.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },

    async initialize() {
      const container = (getContainer() as HTMLElement);
      this.raycaster = new Raycaster();
      this.camera = createOrthographicCamera(container);
      this.scene = createScene();
      applyFog(this.scene);
      this.generateRandomPoints();

      this.title = await addTextMeshToScene(
        this.scene,
        'SPOTIFY CARTOGRAPHY',
        container.clientWidth / (-2.3046875 * container.clientWidth),
        container.clientWidth / 30000,
        0,
        0.05,
        0.05,
        12,
        false,
        0.005,
        0.005,
        0.01,
        1,
        0x11AC84,
      );

      this.loginButton = await addTextMeshToScene(
        this.scene,
        'Login with Spotify',
        container.clientWidth / (-8 * container.clientWidth),
        container.clientHeight / (-50 * container.clientHeight),
        0,
        0.02,
        0.02,
        12,
        false,
        0.005,
        0.005,
        0.01,
        1,
        0x53A0FF,
      );

      this.exampleButton = await addTextMeshToScene(
        this.scene,
        'Example Data',
        container.clientWidth / (-10 * container.clientWidth),
        container.clientHeight / (-10 * container.clientHeight),
        0,
        0.02,
        0.02,
        12,
        false,
        0.005,
        0.005,
        0.01,
        1,
        0xFF9F44,
      );

      addDirectionLightToScene(this.scene);
      addAmbientLightToScene(this.scene);

      this.renderer = createRenderer(container);

      this.animate();
    },

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

    animate() {
      requestAnimationFrame(this.animate);

      if (this.title) {
        (this.title as Mesh).rotation.x = (((this.mouse.y - (window.innerHeight / 2)) / window.innerHeight) * Math.PI) / 10;
        (this.title as Mesh).rotation.y = (((this.mouse.x - (window.innerWidth / 2)) / window.innerWidth) * Math.PI) / 10;
      }

      if (this.loginButton) {
        (this.loginButton as Mesh).rotation.x = (((this.mouse.y - (window.innerHeight / 2)) / window.innerHeight) * Math.PI) / 10;
        (this.loginButton as Mesh).rotation.y = (((this.mouse.x - (window.innerWidth / 2)) / window.innerWidth) * Math.PI) / 10;
      }

      if (this.exampleButton) {
        (this.exampleButton as Mesh).rotation.x = (((this.mouse.y - (window.innerHeight / 2)) / window.innerHeight) * Math.PI) / 10;
        (this.exampleButton as Mesh).rotation.y = (((this.mouse.x - (window.innerWidth / 2)) / window.innerWidth) * Math.PI) / 10;
      }

      (this.raycaster as Raycaster).setFromCamera(this.mouseNormal, this.camera as OrthographicCamera);
      const intersects = (this.raycaster as Raycaster).intersectObjects([this.loginButton as Mesh, this.exampleButton as Mesh]);

      for (let i = 0; i < intersects.length; i += 1) {
        const intersect = intersects[i];

        if (intersect.object === this.loginButton) {
          this.hoverLogin = true;
          ((this.exampleButton as Mesh).material as MeshPhysicalMaterial).color.setHex(0xFF9F44);
          ((this.loginButton as Mesh).material as MeshPhysicalMaterial).color.setHex(0xFFFFFF);
        } else if (intersect.object === this.exampleButton) {
          this.hoverExample = true;
          ((this.exampleButton as Mesh).material as MeshPhysicalMaterial).color.setHex(0xFFFFFF);
          ((this.loginButton as Mesh).material as MeshPhysicalMaterial).color.setHex(0x53A0FF);
        } else {
          this.hoverLogin = false;
          this.hoverExample = false;
        }
      }

      if (intersects.length === 0) {
        this.hoverLogin = false;
        this.hoverExample = false;
        ((this.exampleButton as Mesh).material as MeshPhysicalMaterial).color.setHex(0xFF9F44);
        ((this.loginButton as Mesh).material as MeshPhysicalMaterial).color.setHex(0x53A0FF);
      }

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

    handleClick() {
      if (this.hoverLogin) {
        this.login();
      } if (this.hoverExample) {
        this.samplesMenu = !this.samplesMenu;
        // this.loadExampleData();
        // this.$router.push('/cartography');
      }
    },

    login() {
      this.$store.dispatch('auth/login');
    },
  },

  async mounted() {
    window.addEventListener('mousemove', this.trackMouse);

    this.start = Date.now();

    await this.initialize();
    this.animate();
  },
});
</script>

<style lang="scss" module>
.container {
  &.hovering {
    cursor: pointer;
  }
}

.component {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 15vh;

  h1 {
    display: block;
    font-size: 3rem;
    font-weight: 300;
  }

  button {
    margin-top: 2rem;

    i {
      padding-right: .4rem;
    }
  }
}
</style>
