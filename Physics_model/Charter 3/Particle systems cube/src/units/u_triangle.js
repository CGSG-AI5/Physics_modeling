import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { body_plane } from "../physic/phisics2.js";

export let plane_tr = [];

class Unit_plane {
  constructor(Pr, body){
    this.Pr = Pr;
    this.body = body;
  }
}



export function initTr() {
  let Mtl;
  Mtl = material.set(
    ...Matlib.Ruby,
    [-1, -1, -1, -1, -1, -1, -1, -1],
    0,
    "texture"
  );

  let Vrts = [], Ind = [];
    
  Vrts[0] = new vertex(
    _vec3.set(-10, 0, 5),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  Vrts[1] = new vertex(
    _vec3.set(10, 0, -20),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(1, 1, 0)
  );
  Vrts[2] = new vertex(
    _vec3.set(10, 0, 5),
    _vec3.set(0.47, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 1, 0)
  );

  Ind = [
    0, 1, 2,
  ];

  plane_tr.push(new Unit_plane(   
     prim.create(Vrts, Vrts.length, Ind, Ind.length, material.add(Mtl)),
      new body_plane(_vec3.set((Vrts[0].P.x + Vrts[1].P.x + Vrts[2].P.x) / 3,
      (Vrts[0].P.y + Vrts[1].P.y + Vrts[2].P.y) / 3,
      (Vrts[0].P.z + Vrts[1].P.z + Vrts[2].P.z) / 3,
                                ), [Vrts[0].P, Vrts[1].P, Vrts[2].P], _vec3.set(0, 1, 0))   
  ));


//   floor.push(new Unit_plane(prim.create_plane(40, 60, material.add(Mtl)), new body_infinite_plane(_vec3.set(0, -6, -10), _vec3.set(0, 1, 0)), _vec3.set(0, 0, 0)))
//   floor.push(new Unit_plane(prim.create_plane(18, 60, material.add(Mtl)), new body_infinite_plane(_vec3.set(20, 3, -10), _vec3.set(-1, 0, 0)), _vec3.set(0, 0, 90)))
//   floor.push(new Unit_plane(prim.create_plane(18, 60, material.add(Mtl)), new body_infinite_plane(_vec3.set(-20, 3, -10), _vec3.set(1, 0, 0)), _vec3.set(0, 0, 90)))
  // floor.push(new Unit_plane(prim.create_plane(2, 2, material.add(Mtl)), new body_infinite_plane(_vec3.set(0, 0, -10), _vec3.set(0, 1, 0)), _vec3.set(0, 0, 0)))
  
}

export function renderTr() {
  for (let i = 0; i < plane_tr.length; i++){
    // let Worl = _matr4.mulmatr4(_matr4.rotateX(floor[i].angle.x), _matr4.rotateY(floor[i].angle.y), _matr4.rotateZ(floor[i].angle.z), _matr4.translate(floor[i].body.center_of_mass))
    let World  = _matr4.translate(_vec3.set1(0));
    prim.draw(plane_tr[i].Pr, World);
  }
}