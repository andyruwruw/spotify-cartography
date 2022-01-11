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

import {
  THREE_CONTAINER_ID,
  THREE_BACKGROUND_COLOR,
  POINT_GEOMETRY_DEFAULT_VALUES,
  THREE_DEFAULT_MATERIAL_COLOR,
  PERSPECTIVE_CAMERA_DEFAULT_VALUES,
  ORTHOGRAPHIC_CAMERA_DEFAULT_VALUES,
  ORBIT_CONTROLS_DEFAULT_VALUES,
} from '@/config';
import { FONT } from '@/assets/fonts/helvetiker_bold.typeface';

const BACKGROUND_COLOR = new Color(THREE_BACKGROUND_COLOR);

const DEFAULT_POINT_GEOMETRY = new SphereGeometry(
  POINT_GEOMETRY_DEFAULT_VALUES.radius,
  POINT_GEOMETRY_DEFAULT_VALUES.widthSegment,
  POINT_GEOMETRY_DEFAULT_VALUES.heightSegment,
);

const POINT_MATERIAL = new MeshToonMaterial({
  color: THREE_DEFAULT_MATERIAL_COLOR,
});

const TEXT_MATERIAL = new MeshToonMaterial({
  color: THREE_DEFAULT_MATERIAL_COLOR,
});

/**
 * Retrieves Three.js canvas element by id.
 *
 * @returns {HTMLElement}
 */
export const getContainer = () => document.getElementById(THREE_CONTAINER_ID);

/**
 * Creates a new Perspective camera for a scene.
 *
 * @param {HTMLElement} container Three.js canvas element.
 * @returns {PerspectiveCamera} Camera for scene.
 */
export const createPerspectiveCamera = (container: HTMLElement): PerspectiveCamera => {
  const camera = new PerspectiveCamera(
    PERSPECTIVE_CAMERA_DEFAULT_VALUES.fov,
    container.clientWidth / container.clientHeight,
    PERSPECTIVE_CAMERA_DEFAULT_VALUES.near,
    PERSPECTIVE_CAMERA_DEFAULT_VALUES.far,
  );
  camera.position.z = PERSPECTIVE_CAMERA_DEFAULT_VALUES.z;

  return camera;
};

/**
 * Creates a new Orthographic camera for a scene.
 *
 * @param {HTMLElement} container Three.js canvas element.
 * @returns {PerspectiveCamera} Camera for scene.
 */
export const createOrthographicCamera = (container: HTMLElement): OrthographicCamera => {
  const camera = new OrthographicCamera(
    container.clientWidth / ORTHOGRAPHIC_CAMERA_DEFAULT_VALUES.leftDivisor,
    container.clientWidth / ORTHOGRAPHIC_CAMERA_DEFAULT_VALUES.rightDivisor,
    container.clientHeight / ORTHOGRAPHIC_CAMERA_DEFAULT_VALUES.topDivisor,
    container.clientHeight / ORTHOGRAPHIC_CAMERA_DEFAULT_VALUES.bottomDivisor,
    ORTHOGRAPHIC_CAMERA_DEFAULT_VALUES.near,
    ORTHOGRAPHIC_CAMERA_DEFAULT_VALUES.far,
  );
  camera.position.z = ORTHOGRAPHIC_CAMERA_DEFAULT_VALUES.z;

  return camera;
};

/**
 * Creates new orbit controls for a scene.
 *
 * @param {Camera} camera Camera for scene.
 * @param {HTMLElement} container Three.js canvas element.
 * @returns {OrbitControls} Controls for scene.
 */
export const createOrbitControls = (camera: Camera, container: HTMLElement): OrbitControls => {
  const controls = new OrbitControls(camera, container);
  controls.enableDamping = ORBIT_CONTROLS_DEFAULT_VALUES.enableDamping as boolean;
  controls.dampingFactor = ORBIT_CONTROLS_DEFAULT_VALUES.dampingFactor as number;
  controls.enableZoom = ORBIT_CONTROLS_DEFAULT_VALUES.enableZoom as boolean;
  controls.maxDistance = ORBIT_CONTROLS_DEFAULT_VALUES.maxDistance as number;
  controls.minDistance = ORBIT_CONTROLS_DEFAULT_VALUES.minDistance as number;

  return controls;
};

/**
 * Creates a new Three.js scene.
 *
 * @returns {Scene} New scene.
 */
export const createScene = (): Scene => {
  const scene = new Scene();
  scene.background = BACKGROUND_COLOR;

  return scene;
};

/**
 * Creates a new WebGLRenderer.
 *
 * @param {HTMLElement} container Three.js canvas element.
 * @returns {WebGLRenderer} Three.js renderer.
 */
export const createRenderer = (container: HTMLElement): WebGLRenderer => {
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);

  container.appendChild(renderer.domElement);

  return renderer;
};

/**
 * Applies for to a Three.js scene.
 *
 * @param {Scene} scene Three.js scene to add fog to.
 * @param {string} modifier Type of fog.
 */
export const applyFog = (scene: Scene, modifier: string | undefined = undefined) => {
  if (modifier === undefined) {
    scene.fog = new Fog(BACKGROUND_COLOR, 0.0025, 50);
  } else if (modifier === 'short') {
    scene.fog = new Fog(BACKGROUND_COLOR, 0.0025, 3);
  }
};

/**
 * Adds random offset to coordinates to avoid Three.js conflicts.
 *
 * @param {number} value Value to add offset to.
 * @returns {number} Value with offset.
 */
const applyRandomOffset = (value: number) => value + Math.floor(Math.random() * 10000) * 0.000001;

/**
 * Adds a point to the Three.js scene.
 *
 * @param {Scene} scene Three.js scene to add point to.
 * @param {number} x X coordinate of point.
 * @param {number} y Y coordinate of point.
 * @param {number} z Z coordinate of point.
 * @param {Color} [color = undefined] Color of the point.
 * @returns {Mesh} Mesh of point added to scene.
 */
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

  const mesh = new Mesh(DEFAULT_POINT_GEOMETRY, usedMaterial);

  mesh.position.x = applyRandomOffset(x);
  mesh.position.y = applyRandomOffset(y);
  mesh.position.z = applyRandomOffset(z);

  scene.add(mesh);

  return mesh;
};

/**
 * Adds a text mesh to the Three.js scene.
 *
 * @param {Scene} scene Three.js scene to add point to.
 * @param {string} text Text of the text mesh.
 * @param {number} x X coordinate of point.
 * @param {number} y Y coordinate of point.
 * @param {number} z Z coordinate of point.
 * @param {number} size
 * @param {number} height
 * @param {number} curveSegments
 * @param {number} bevelEnabled
 * @param {number} bevelThickness
 * @param {number} bevelSize
 * @param {number} bevelOffset
 * @param {number} bevelSegments
 * @param {number} [color = undefined] Color of the text mesh.
 * @returns {Mesh} Mesh of point added to scene.
 */
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

/**
 * Adds an ambient light to the Three.js scene.
 *
 * @param {Scene} scene Three.js scene to add ambient light to.
 * @returns {AmbientLight} Ambient light added to scene.
 */
export const addAmbientLightToScene = (scene: Scene): AmbientLight => {
  const light = new AmbientLight(0x000000);

  scene.add(light);

  return light;
};

/**
 * Adds a directional light to the Three.js scene.
 *
 * @param {Scene} scene Three.js scene to add directional light to. 
 * @returns {DirectionalLight} Directional light added to scene.
 */
export const addDirectionLightToScene = (scene: Scene): DirectionalLight => {
  const light = new DirectionalLight(0xffffff, 1.3);

  light.position.set(1, 1, 1);

  scene.add(light);

  return light;
};

/**
 * Adds a point light to the Three.js scene.
 *
 * @param {Scene} scene Three.js scene to add point light to.  
 * @returns {PointLight} Point light added to scene.
 */
export const addPointLightToScene = (scene: Scene): PointLight => {
  const light = new PointLight(0xffffff, 0.05, 100);
  light.position.set(50, 50, 50);

  scene.add(light);

  return light;
};
