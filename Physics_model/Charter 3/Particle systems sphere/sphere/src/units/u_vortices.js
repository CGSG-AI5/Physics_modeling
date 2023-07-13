import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myInput } from "../input.js";
import { Tex } from "../rnd/res/texture.js";
import { body_vortices } from "../physic/phisics1.js";



export let VorticesList = [];

class Vortices {
    constructor (Pr, body){
        this.Pr = Pr;
        this.body = body;
    }
}

export function initVortices() {

  let Mtl;
  Mtl = material.set(
    ...Matlib.Obsidian,
    [-1, -1, -1, -1, -1, -1, -1, -1],
    0,
    "lines"
  );


  let Vrts = [], Ind = [];
  Vrts[0] = new vertex(
    _vec3.set(0, -0.5, 0),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  
  Vrts[1] = new vertex(
    _vec3.set(0, 0.5, 0),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Ind = [0, 1];
  let L = 100;

  let Pr_attrac = prim.create_sphere(
    50, 50, 30,
    material.add(Mtl)
  );

  let Pr = prim.create(Vrts, Vrts.length, Ind, Ind.length, material.add(Mtl))
  VorticesList.push(new Vortices(Pr, new body_vortices(_vec3.set(0, 30, 0), _vec3.set(0, 1, 0), 20, 50, 0.03185)))
}

export function renderVortices() {
    for (let i = 0; i < VorticesList.length; i++){
        let Worl = _matr4.mulmatr(_matr4.scale(_vec3.set(1, 10, 1)), _matr4.translate(VorticesList[i].body.center_of_mass))
        prim.draw(VorticesList[i].Pr, Worl);
    }

}