import { FONT } from '@/assets/fonts/helvetiker_bold.typeface';
import {
  AmbientLight,
  Camera,
  Color,
  DirectionalLight,
  Fog,
  Mesh,
  MeshToonMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const CONTAINER_ID = 'container';

const VIEW_DISTANCE = 10000;

const BACKGROUND_COLOR = new Color(0x191927);

const POINT_GEOMETRY = new SphereGeometry(0.005, 3, 2);

const LARGE_POINT_GEOMETRY = new SphereGeometry(1, 3, 2);

const POINT_MATERIAL = new MeshToonMaterial({
  color: 0xffffff,
});

const TEXT_MATERIAL = new MeshToonMaterial({
  color: 0xffffff,
});

export const getContainer = () => document.getElementById(CONTAINER_ID);

export const createPerspectiveCamera = (container: HTMLElement): PerspectiveCamera => {
  const camera = new PerspectiveCamera(
    70,
    container.clientWidth / container.clientHeight,
    0.01,
    VIEW_DISTANCE,
  );
  camera.position.z = 1;

  return camera;
};

export const createOrthographicCamera = (container: HTMLElement): OrthographicCamera => {
  const camera = new OrthographicCamera(
    container.clientWidth / (-2 * 1000),
    container.clientWidth / (2 * 1000),
    container.clientHeight / (2 * 1000),
    container.clientHeight / (-2 * 1000),
    1,
    VIEW_DISTANCE,
  );
  camera.position.z = 5;

  return camera;
};

export const createOrbitControls = (camera: Camera, container: HTMLElement): OrbitControls => {
  const controls = new OrbitControls(camera, container);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = true;
  controls.maxDistance = 100;
  controls.minDistance = 0.001;

  return controls;
};

export const createScene = (): Scene => {
  const scene = new Scene();
  scene.background = BACKGROUND_COLOR;

  return scene;
};

export const createRenderer = (container: HTMLElement): WebGLRenderer => {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);

  container.appendChild(renderer.domElement);

  return renderer;
};

export const applyFog = (scene: Scene, modifier: string | undefined = undefined) => {
  if (modifier === undefined) {
    scene.fog = new Fog(BACKGROUND_COLOR, 0.0025, 50);
  } else if (modifier === 'short') {
    scene.fog = new Fog(BACKGROUND_COLOR, 0.0025, 3);
  }
};

const applyRandomOffset = (value: number) => value + Math.floor(Math.random() * 10000) * 0.000001;

export const addPointMeshToScene = (
  scene: Scene,
  x: number,
  y: number,
  z: number,
  color: undefined | Color = undefined,
): Mesh => {
  let usedMaterial = POINT_MATERIAL;

  if (color !== undefined) {
    usedMaterial = new MeshToonMaterial({
      color,
    });
  }

  const mesh = new Mesh(POINT_GEOMETRY, usedMaterial);

  mesh.position.x = applyRandomOffset(x);
  mesh.position.y = applyRandomOffset(y);
  mesh.position.z = applyRandomOffset(z);

  scene.add(mesh);

  return mesh;
};

export const addLargePointMeshToScene = (
  scene: Scene,
  x: number,
  y: number,
  z: number,
): Mesh => {
  const mesh = new Mesh(LARGE_POINT_GEOMETRY, POINT_MATERIAL);

  mesh.position.x = applyRandomOffset(x);
  mesh.position.y = applyRandomOffset(y);
  mesh.position.z = applyRandomOffset(z);

  scene.add(mesh);

  return mesh;
};

export const addTextMeshToScene = async (
  scene: Scene,
  text: string,
  x: number,
  y: number,
  z: number,
  size = 80,
  height = 5,
  curveSegments = 12,
  bevelEnabled = true,
  bevelThickness = 10,
  bevelSize = 8,
  bevelOffset = 0,
  bevelSegments = 5,
  color: number | undefined = undefined,
): Promise<Mesh> => {
  const fontLoader = new FontLoader();
  const font = await fontLoader.parse(FONT);

  const geometry = new TextGeometry(text, {
    font,
    size,
    height,
    curveSegments,
    bevelEnabled,
    bevelThickness,
    bevelSize,
    bevelOffset,
    bevelSegments,
  });

  let usedMaterial = TEXT_MATERIAL;

  if (color !== undefined) {
    usedMaterial = new MeshToonMaterial({
      color,
    });
  }

  const mesh = new Mesh(geometry, usedMaterial);

  mesh.position.x = x;
  mesh.position.y = y;
  mesh.position.z = z;

  mesh.name = text;

  scene.add(mesh);

  return mesh;
};

export const addAmbientLightToScene = (scene: Scene): AmbientLight => {
  const light = new AmbientLight(0x000000);

  scene.add(light);

  return light;
};

export const addDirectionLightToScene = (scene: Scene): DirectionalLight => {
  const light = new DirectionalLight(0xffffff, 1.3);

  light.position.set(1, 1, 1);

  scene.add(light);

  return light;
};

export const addPointLightToScene = (scene: Scene): PointLight => {
  const light = new PointLight(0xffffff, 0.05, 100);
  light.position.set(50, 50, 50);

  scene.add(light);

  return light;
};

// https://stackoverflow.com/questions/17433015/change-the-hue-of-a-rgb-color-in-javascript\
function normalize_rgb_value(color: number, m: number) {
  color = Math.floor((color + m) * 255);
  if (color < 0) {
    color = 0;
  }
  return color;
}

const hslToRGB = (hsl: Record<string, number>): Record<string, number> => {
  const { h } = hsl;
  const { s } = hsl;
  const { l } = hsl;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  // eslint-disable-next-line no-mixed-operators
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = normalize_rgb_value(r, m);
  g = normalize_rgb_value(g, m);
  b = normalize_rgb_value(b, m);

  return {
    r,
    g,
    b,
  };
};

const rgbToHSL = (rgb: string): Record<string, number> => {
  // strip the leading # if it's there
  rgb = rgb.replace(/^\s*#|\s*$/g, '');

  // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
  if (rgb.length === 3) {
    rgb = rgb.replace(/(.)/g, '$1$1');
  }

  const r = parseInt(rgb.substr(0, 2), 16) / 255;
  const g = parseInt(rgb.substr(2, 2), 16) / 255;
  const b = parseInt(rgb.substr(4, 2), 16) / 255;
  const cMax = Math.max(r, g, b);
  const cMin = Math.min(r, g, b);
  const delta = cMax - cMin;
  const l = (cMax + cMin) / 2;
  let h = 0;
  let s = 0;

  if (delta === 0) {
    h = 0;
  } else if (cMax === r) {
    h = 60 * (((g - b) / delta) % 6);
  } else if (cMax === g) {
    h = 60 * (((b - r) / delta) + 2);
  } else {
    h = 60 * (((r - g) / delta) + 4);
  }

  if (delta === 0) {
    s = 0;
  } else {
    s = (delta / (1 - Math.abs(2 * l - 1)));
  }

  return {
    h,
    s,
    l,
  };
};

const changeHue = (rgb: string, degree: number): Record<string, number> => {
  const hsl = rgbToHSL(rgb);
  hsl.h += degree;
  if (hsl.h > 360) {
    hsl.h -= 360;
  } else if (hsl.h < 0) {
    hsl.h += 360;
  }
  return hslToRGB(hsl);
};

export const getColor = (hue: number): Color => {
  const red = '#FF0000';
  const newColor = changeHue(red, hue * 360);
  return new Color(
    newColor.r,
    newColor.g,
    newColor.b,
  );
};
