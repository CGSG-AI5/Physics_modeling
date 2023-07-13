import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myInput } from "../input.js";
import { Tex, Textures } from "../rnd/res/texture.js";

let Pr_text;

export function initText() {
  let Vrts = [];

  Vrts[0] = new vertex(
    _vec3.set(-1, 1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 0, 0)
  );
  Vrts[1] = new vertex(
    _vec3.set(-1, -1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 1, 0)
  );
  Vrts[2] = new vertex(
    _vec3.set(1, 1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1),
    _vec3.set(1, 0, 0)
  );
  Vrts[3] = new vertex(
    _vec3.set(1, -1, 1),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1),
    _vec3.set(1, 1, 0)
  );

  let indices = [
    0, 1, 2,

    1, 2, 3,
  ];
  let Mtl = material.set(
    ...Matlib.Black_Plastic,
    [Tex.create("cgsg.png"), -1, -1, -1, -1, -1, -1, -1],
    0,
    "texture"
  );
  console.log(Textures);
  //   Mtl = new material(
  //     _vec3.set(),
  //     _vec3.set(0.23125, 0.23125, 0.23125),
  //     _vec3.set(0.2775, 0.2775, 0.2775),
  //     _vec3.set(0.773911, 0.773911, 0.773911),
  //     9.8,
  //     1,
  //     [-1, -1, -1, -1, -1, -1, -1, -1]
  //   );
  Pr_text = prim.create(
    Vrts,
    Vrts.length,
    indices,
    indices.length,
    material.add(Mtl)
  );
}

export function renderText() {
  let Worl = _matr4.mulmatr(
    _matr4.scale(_vec3.set(10, 6, 0.7)),
    _matr4.translate(_vec3.set(0, 0, -39.9))
  );

  prim.draw(Pr_text, Worl);
}
