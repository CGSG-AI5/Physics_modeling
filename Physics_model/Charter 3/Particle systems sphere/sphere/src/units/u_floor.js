import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { body_infinite_plane } from "../physic/phisics1.js";

export let floor = [];

class Unit_plane {
  constructor(Pr, body, angle) {
    this.Pr = Pr
    this.body = body;
    this.angle = angle
  }
}

export function initFloor() {
  let Mtl1 = material.set(
    ...Matlib.Ruby,
    [-1, -1, -1, -1, -1, -1, -1, -1],
    0,
    "texture"
  );
  let Mtl2 = material.set(
    ...Matlib.Gold,
    [-1, -1, -1, -1, -1, -1, -1, -1],
    0,
    "texture"
  );
  floor.push(new Unit_plane(prim.create_plane(40, 60, material.add(Mtl1)), new body_infinite_plane(_vec3.set(0, -6, -10), _vec3.set(0, 1, 0)), _vec3.set(0, 0, 0)))
  floor.push(new Unit_plane(prim.create_plane(18, 60, material.add(Mtl1)), new body_infinite_plane(_vec3.set(20, 3, -10), _vec3.set(-1, 0, 0)), _vec3.set(0, 0, 90)))
  floor.push(new Unit_plane(prim.create_plane(18, 60, material.add(Mtl2)), new body_infinite_plane(_vec3.set(-20, 3, -10), _vec3.set(1, 0, 0)), _vec3.set(0, 0, 90)))
  // floor.push(new Unit_plane(prim.create_plane(2, 2, material.add(Mtl)), new body_infinite_plane(_vec3.set(0, 0, -10), _vec3.set(0, 1, 0)), _vec3.set(0, 0, 0)))
  
}

export function renderFloor() {
  for (let i = 0; i < floor.length; i++){
    let Worl = _matr4.mulmatr4(_matr4.rotateX(floor[i].angle.x), _matr4.rotateY(floor[i].angle.y), _matr4.rotateZ(floor[i].angle.z), _matr4.translate(floor[i].body.center_of_mass))

    prim.draw(floor[i].Pr, Worl);
  }
}
