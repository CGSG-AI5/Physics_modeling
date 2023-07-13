import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myInput } from "../input.js";
import { Tex } from "../rnd/res/texture.js";
import { body_attractor_line } from "../physic/phisics1.js";



export let PlanetLine = [];

class Line {
    constructor (Pr, body){
        this.Pr = Pr;
        this.body = body;
    }
}

export function initAttractorLine() {

  let Mtl;
  Mtl = material.set(
    ...Matlib.Obsidian,
    [-1, -1, -1, -1, -1, -1, -1, -1],
    0,
    "lines"
  );


  let Vrts = [], Ind = [];
  Vrts[0] = new vertex(
    _vec3.set(0, 0, -0.5),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  
  Vrts[1] = new vertex(
    _vec3.set(0, 0, 0.5),
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
  PlanetLine.push(new Line(Pr, new body_attractor_line(_vec3.set(-50, 50, -50), _vec3.set(0, 0, 1), L, 3000, 2)))
}

export function renderAttractorLine() {
    for (let i = 0; i < PlanetLine.length; i++){
        let Worl = _matr4.mulmatr(_matr4.scale(_vec3.set(1, 1, PlanetLine[i].body.L)), _matr4.translate(PlanetLine[i].body.center_of_mass))
        prim.draw(PlanetLine[i].Pr, Worl);
    }

}