import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";

import { AddTriangleFromVoxelGrid } from "../rnd/voxel.js";

export let triangle = [];

class Unit_triangle {
  constructor(Pr, p, n) {
    this.Pr = Pr
    this.p = p;
    this.n = n;
  }
}

export function initTriangle() {
    let W = 10, H = 10;
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

    let Vrts = [], Ind = [];
    
    Vrts[0] = new vertex(
      _vec3.set(-W/2, 0, H/2),
      _vec3.set(0.47, 0.3, 0.27),
      _vec3.set(0, 1, 0),
      _vec3.set(0, 0, 0)
    );
    Vrts[1] = new vertex(
      _vec3.set(W / 2, 0, -H / 2),
      _vec3.set(0.47, 0.3, 0.27),
      _vec3.set(0, 1, 0),
      _vec3.set(1, 1, 0)
    );
    Vrts[2] = new vertex(
      _vec3.set(W / 2, 0, H / 2),
      _vec3.set(0.47, 0.3, 0.27),
      _vec3.set(0, 1, 0),
      _vec3.set(0, 1, 0)
    );
  
    Ind = [
      0, 1, 2,
    ];
    AddTriangleFromVoxelGrid([Vrts[0].P, Vrts[1].P, Vrts[2].P], triangle.length)
    triangle.push(new Unit_triangle(prim.create(Vrts, Vrts.length, Ind, Ind.length, material.add(Mtl2)), _vec3.set(0, 0.8, 0), _vec3.set(0, 1, 0)))

}

export function renderTriangle() {
    let Worl = _matr4.translate(triangle[0].p)

    prim.draw(triangle[0].Pr, Worl);
}