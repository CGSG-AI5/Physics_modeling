import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4, D2R, R2D } from "../math/mathmat4.js";
import { myTimer } from "../timer.js";
import { myInput } from "../input.js";
import { cam } from "../math/mathcam.js";
import { body_cube } from "../physic/phisics2.js";
import { fall } from "../physic/phisics2.js";

let Pr_cube;
let Cube;
class Unit_cube{
  constructor(Pr, body){
    this.Pr = Pr
    this.body = body;
  }
}

export function initCube() {
  let Vrts = [];
  let W = 2, H = 2, D = 2;

  Vrts[0] = new vertex(
    _vec3.set(-W/2, H / 2, D/2),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(1, 0, 0),
    _vec3.set(0, 0, 0)
  );
  Vrts[1] = new vertex(
    _vec3.set(W / 2, -H/2, D / 2),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(1, 1, 0)
  );
  Vrts[2] = new vertex(
    _vec3.set(W / 2, H/2, D / 2),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 1),
    _vec3.set(0, 1, 0)
  );
  Vrts[3] = new vertex(
    _vec3.set(-W/2, -H/2, D/2),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 0),
    _vec3.set(1, 0, 0)
  );

  Vrts[4] = new vertex(
    _vec3.set(-W/2, H/2, -D/2),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 0, 0)
  );
  Vrts[5] = new vertex(
    _vec3.set(W / 2, -H/2, -D / 2),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 0),
    _vec3.set(1, 1, 0)
  );
  Vrts[6] = new vertex(
    _vec3.set(W / 2, H / 2, -D / 2),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 0),
    _vec3.set(0, 1, 0)
  );
  Vrts[7] = new vertex(
    _vec3.set(-W/2, -H/2, -D/2),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 0, 0),
    _vec3.set(1, 0, 0)
  );

  let Mtl = material.set(...Matlib.Gold, [-1, -1, -1, -1, -1, -1, -1, -1], 0, "texture");
  Pr_cube = prim.create_cube(W, H, D, material.add(Mtl))

  for (let i = 0; i < Vrts.length; i++){
    Vrts[i].P = _vec3.vectort_ransform(Vrts[i].P, _matr4.rotateX(0));
  }

  Cube = new Unit_cube(Pr_cube, new body_cube( 
  _vec3.set(10, 0, -10),
  _vec3.set(10, 0, 0),
    1,
    1,
    0,
    [Vrts[0].P, Vrts[1].P, Vrts[2].P, Vrts[3].P,
     Vrts[4].P, Vrts[5].P, Vrts[6].P, Vrts[7].P,]
  ))
}

export function renderCube() {
  fall(Cube.body)
  let Worl = _matr4.mulmatr(_matr4.rotateX(0) ,_matr4.translate(Cube.body.center_of_mass));

  prim.draw(Cube.Pr, Worl);
}
