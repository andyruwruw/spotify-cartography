// https://codinhood.com/post/create-skybox-with-threejs
import {
  BackSide,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  TextureLoader,
} from 'three';

const createPathStrings = (filename: string) => {
  const baseFilename = `./assets/skybox/${filename}`;
  const fileType = '.png';
  const sides = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];
  const pathStings = sides.map((side) => `${baseFilename}_${side}${fileType}`);
  return pathStings;
};

const createMaterialArray = (filename: string): Array<MeshBasicMaterial> => {
  const skyboxImagepaths = createPathStrings(filename);

  const materialArray = skyboxImagepaths.map((image: string) => {
    console.log(image);
    const texture = new TextureLoader().load(image);
    return new MeshBasicMaterial({ map: texture, side: BackSide }); // <---
  });

  return materialArray;
};

export const createSkyBoxMesh = () => {
  const skyboxImage = 'galaxy';

  const materialArray = createMaterialArray(skyboxImage);
  const skyboxGeo = new BoxGeometry(1000, 1000, 1000);
  return new Mesh(skyboxGeo, materialArray);
};
