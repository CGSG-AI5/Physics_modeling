import { prim } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4, D2R } from "../math/mathmat4.js";

import { Tex } from "../rnd/res/texture.js";
import { body_sphere, fall} from "../physic/phisics1.js";
import { myTimer } from "../timer.js";

import { distributedNormalPosition, gaussianRandom, directionVectorAngulOfsetNormal,getRandomArbitary } from "../math/mathrandom.js";



let ball = [];
let Pr_ball;
let p = _vec3.set(0, 15, -10);
let f = 0, r = 1000, n = 0;
let mu_s = 8, delts_s = 4;
let nor = _vec3.set(0, 1, 0);
let p0 = _vec3.add(p, _vec3.set(-2, 0, 0))
let p1 = _vec3.add(p, _vec3.set(1, 0, Math.sqrt(3)))
let p2 = _vec3.add(p, _vec3.set(1, 0, -Math.sqrt(3)))
export function FreeParctInTriangle(){
    ball = [];
    n = 0;
}

export function initParctInTriangle() {
  let MtlNo2 = material.add(material.set(
    ...Matlib.Obsidian,
    [Tex.create("venera.jpg"), -1, -1, -1, -1, -1, -1, -1],
    0,
    "texture"
  ));

  Pr_ball = prim.create_sphere(5, 5, 0.5, MtlNo2)
}

export function renderParctInTriangle() {
  
  f = f + (r * myTimer.globalDeltaTime)

  if (f > 1){
    for(let i = 0; i < 10; i++){
      let s = gaussianRandom(mu_s, delts_s / 3)
      let Vn = directionVectorAngulOfsetNormal(nor, D2R(45));
      let u = 1, v = 1;
      while (u + v > 1){
        u = getRandomArbitary(0, 1);
        v = getRandomArbitary(0, 1)
      }
      let pn = _vec3.add(_vec3.add(_vec3.mulnum(p0, u), _vec3.mulnum(p1, v)), _vec3.mulnum(p2, (1 - u - v)))
      let time_create = getRandomArbitary(0, 1);
      pn = _vec3.add(pn, _vec3.mulnum(Vn, time_create * myTimer.globalDeltaTime))
      ball.push(
        new body_sphere(
          pn,
          _vec3.mulnum(Vn, s),
          0.5,
          1,
          0,
        ),
      )
      n += 1;
    }
    f -= 1;
  }

  for (let i = 0; i < n; i++){ 
    if (!ball[i].IsState){
      if (fall(ball[i])){
        FreeParctInTriangle();
        return;
      }
    }
  
    let World = _matr4.translate(ball[i].center_of_mass)
    prim.draw(Pr_ball, World);
  
  }
}