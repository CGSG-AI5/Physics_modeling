import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myInput } from "../input.js";

let Pr_wall;

export function initWall() {
  let Vrts = [];

  Vrts[0] = new vertex(
    _vec3.set(-2, 2, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 0, 0)
  );
  Vrts[1] = new vertex(
    _vec3.set(-2, -1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 0, 0)
  );
  Vrts[2] = new vertex(
    _vec3.set(2, 2, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 0, 0)
  );
  Vrts[3] = new vertex(
    _vec3.set(2, -1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 0, 0)
  );

  let indices = [
    0, 1, 2,

    1, 2, 3,
  ];
  let Mtl;
  Mtl = material.set(
    ...Matlib.Obsidian,
    [-1, -1, -1, -1, -1, -1, -1, -1],
    0,
    "texture"
  );

  Pr_wall = prim.create(
    Vrts,
    Vrts.length,
    indices,
    indices.length,
    material.add(Mtl)
  );
}

export function renderWall() {
  let Worl = _matr4.mulmatr(
    _matr4.scale(_vec3.set(10, 6, 0.7)),
    _matr4.translate(_vec3.set(0, 0, -40))
  );

  prim.draw(Pr_wall, Worl);
}
