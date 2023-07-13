import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { Tex } from "../rnd/res/texture.js";
import { body_sphere, fall, UpdateAccelerations } from "../physic/phisics1.js";
import { myTimer } from "../timer.js";
import { GenerateOmniDirect, GenerateDirect } from "../rnd/parcticlegenerate.js";
import { cam } from "../math/mathcam.js";
import { getRandomArbitary } from "../math/mathrandom.js";

export let points = [];


let Parct = [];
let N = 8000;
let Pr_ball;
let Vrts = [], Ind = [];
let Mtl1;
    
Vrts[0] = new vertex(
  _vec3.set(0, 0, 0),
  _vec3.set(1, 0, 0),
  _vec3.set(0, 1, 0),
  _vec3.set(0, 0, 0)
);

Ind = [0];


class Parcticle{
  constructor(IsActive, body, Pr, TimeLive){
    this.IsActive = IsActive;
    this.body = body;
    this.Pr = Pr;
    this.TimeLive = TimeLive;
  }
}

class ParcticleList{
  constructor (ParcticleStack, InActiveStack, InActiveCount){
    this.ParcticleStack = ParcticleStack;
    this.InActiveStack = InActiveStack;
    this.InActiveCount = InActiveCount;
  }

  Clear(){

    for(let i = 0; i < N; i++){
      Vrts[0].C = _vec3.set(getRandomArbitary(0, 1), getRandomArbitary(0, 1), getRandomArbitary(0, 1))
      Pr_ball = prim.create(Vrts, Vrts.length, Ind, Ind.length, material.add(Mtl1))
      this.ParcticleStack[i] = new Parcticle(false, new body_sphere(_vec3.set1(0), _vec3.set1(0), _vec3.set1(0), 0.5, 1, 0), Pr_ball, 0)
    }
    
    for(let i = 0; i < N; i++){
      this.InActiveStack[i] = i;
    }

    this.InActiveCount = N;
  }

  TestAndDeatactivate(t){
    for (let i = 0; i < N; i++){
      if (this.ParcticleStack[i].IsActive){
        if (_vec3.len(_vec3.sub(this.ParcticleStack[i].body.center_of_mass, _vec3.set(0, 50, -80))) < 30 ){ // || _vec3.len(_vec3.sub(this.ParcticleStack[i].body.center_of_mass, _vec3.set(0, 50, -80))) > 100
          this.ParcticleStack[i].IsActive = false;
          this.InActiveStack.push(i);
          this.InActiveCount++;
        }
        else{
          this.ParcticleStack[i].TimeLive += t; 
        }
      }
    }
  }

  ComputeAccelerations(){
    for (let i = 0; i < N; i++){
      if (this.ParcticleStack[i].IsActive){
        UpdateAccelerations(this.ParcticleStack[i].body)
      }
    }
  }

  Display(){
    for (let i = 0; i < N; i++){
      if (this.ParcticleStack[i].IsActive){
        let World = _matr4.translate(this.ParcticleStack[i].body.center_of_mass);
        prim.draw(this.ParcticleStack[i].Pr, World);
      }
    }
  }
  IntegrateFall(t){
    for (let i = 0; i < N; i++){
      if (this.ParcticleStack[i].IsActive){
        fall(this.ParcticleStack[i].body, t)
      }
    }
  }
}

let p = _vec3.set(0, 35, -10);
let f = 0, r = 300;
let mu_s = 10, delts_s = 5;


export function initPoint() {
  Mtl1 = material.set(
    ...Matlib.Ruby,
    [-1, -1, -1, -1, -1, -1, -1, -1],
    0,
    "default"
  );


  Parct = new ParcticleList([], [], 0);
  Parct.Clear();
}

export function renderPoint() {
  
    f = f + (r * myTimer.globalDeltaTime)

    if (f > 1){
      f -= GenerateDirect(Parct, mu_s, delts_s, myTimer.globalDeltaTime, p, _vec3.set(-1, 0, 0), 20, Math.floor(f))
    }
  
    Parct.TestAndDeatactivate(myTimer.globalDeltaTime);
    Parct.ComputeAccelerations();
    Parct.Display();
   Parct.IntegrateFall(myTimer.globalDeltaTime)
  }
  