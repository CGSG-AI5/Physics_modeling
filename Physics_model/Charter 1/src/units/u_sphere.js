import { prim } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";

import { Tex } from "../rnd/res/texture.js";
import { body_sphere, fall} from "../physic/phisics1.js";



let ball;
class Unit_sphere {
  constructor(Pr, body) {
    this.Pr = Pr
    this.body = body;
  }
}

export function initSphere() {
  let MtlNo2 = material.add(material.set(
    ...Matlib.Obsidian,
    [Tex.create("moon.png"), -1, -1, -1, -1, -1, -1, -1],
    0,
    "texture"
  ));

  ball =
    new Unit_sphere(
      prim.create_sphere(50, 50, 1, MtlNo2),
      new body_sphere(
        _vec3.set(-10, 15, -10),
        _vec3.set(10, 0, 0),
        1,
        1,
      ),
    )
}

export function renderSphere() {
  fall(ball.body);

  let World = _matr4.translate(ball.body.center_of_mass)

  prim.draw(ball.Pr, World);

}
