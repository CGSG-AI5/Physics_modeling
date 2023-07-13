import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myInput } from "../input.js";
import { Tex } from "../rnd/res/texture.js";
import { body_attractor_sphere } from "../physic/phisics1.js";



export let Planet = [];

class Sun {
    constructor (Pr, body){
        this.Pr = Pr;
        this.body = body;
    }
}

export function initAttractorSphere() {

  let Mtl;
  Mtl = material.set(
    ...Matlib.Obsidian,
    [Tex.create("sun.jpg"), -1, -1, -1, -1, -1, -1, -1],
    0,
    "texture"
  );

  let Pr_attrac = prim.create_sphere(
    50, 50, 5,
    material.add(Mtl)
  );
  Planet.push(new Sun(Pr_attrac, new body_attractor_sphere(_vec3.set(0, 50, -80), 3000, 2, 5, 20)))
}

export function renderAttractorSphere() {
    for (let i = 0; i < Planet.length; i++){
        let Worl = _matr4.translate(Planet[i].body.center_of_mass)
        prim.draw(Planet[i].Pr, Worl);
    }

}