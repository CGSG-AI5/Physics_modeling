import { prim } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";

import { Tex } from "../rnd/res/texture.js";
import { body_sphere, fall, UpdateAccelerations, IntegrateStateVector} from "../physic/phisics1.js";
import { myTimer } from "../timer.js";

import { GenerateOmniDirect, GenerateDirect, GenerateDisk, GenerateTriangle, GenerateSphere, GenerateCube } from "../rnd/parcticlegenerate.js";
import { CopyInStateVector, ForceToVectorState, PasteInParcticle } from "../math/mathstatevec.js";
import { InVoxel, UpdateVoxelSizeCell } from "../rnd/voxel.js";
import { getRandomArbitary } from "../math/mathrandom.js";



let Parct = [];
export let N = 1000;
let Pr_ball;
let State_Vector = new Array(N * 3 + 1);
let State_Vector_derivative = new Array(N * 2);

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
      this.ParcticleStack[i] = new Parcticle(false, new body_sphere(_vec3.set1(0), _vec3.set1(0), _vec3.set1(0), 0.5, 1, 0), Pr_ball, 1)
    }
    
    for(let i = 0; i < N; i++){
      this.InActiveStack[i] = i;
    }

    this.InActiveCount = N;
  }

  TestAndDeatactivate(t){
    for (let i = 0; i < N; i++){
      if (this.ParcticleStack[i].IsActive){
        if (_vec3.len(_vec3.sub(this.ParcticleStack[i].body.center_of_mass, _vec3.set(0, 50, -80))) < 5 || !InVoxel(this.ParcticleStack[i].body.center_of_mass)){
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
        let Vn = this.ParcticleStack[i].body.V;

        if (_vec3.equel(Vn, _vec3.set(0, 0, 0))){
          Vn = this.ParcticleStack[i].body.a
        }
        let uz = _vec3.normalize(Vn)
        let a = _vec3.set(1, 0, 0)
        if (uz.y == 0 && uz.z == 0){
          a = _vec3.set(0, 1, 0)
        }
        let uy =  _vec3.normalize(_vec3.set(Vn.y, -Vn.x, 0))
        uy  = _vec3.cross(a, uz);
        let ux = _vec3.normalize(_vec3.cross(uy, uz))

        let M = _matr4.set(ux.x, uy.x, uz.x, 0,
                           ux.y, uy.y, uz.y, 0,
                           ux.z, uy.z, uz.z, 0,
                           0, 0, 0, 1)

        if (_vec3.equel(Vn, _vec3.set1(0))){
          M =_matr4.identity()
        }
        // pn = _vec3.add(_vec3.add(_vec3.mulnum(ux, pn.z), _vec3.mulnum(uy, pn.y)), _vec3.mulnum(uz, pn.x)) 
        let World = _matr4.mulmatr(_matr4.scale(_vec3.mulnum(_vec3.set(1, 0.5, 2), this.ParcticleStack[i].body.scale)), _matr4.mulmatr(M, _matr4.translate(this.ParcticleStack[i].body.center_of_mass)))
        prim.draw(this.ParcticleStack[i].Pr, World);
      }
    }
  }
  IntegrateFall(t){
    CopyInStateVector(State_Vector, this.ParcticleStack);
    ForceToVectorState(State_Vector, State_Vector_derivative, this.ParcticleStack);
    IntegrateStateVector(State_Vector, State_Vector_derivative);
    PasteInParcticle(State_Vector,this.ParcticleStack)

    // for (let i = 0; i < N; i++){
    //   if (this.ParcticleStack[i].IsActive){
    //     fall(this.ParcticleStack[i].body, t)
    //   }
    // }
  }
}

let p = _vec3.set(0, 50, -60);
let f = 0, r = N / 50;
let mu_s = 15, delts_s = 3;
let w =  _vec3.set(-1, 0, 0);
let Angle = 30;
let R = 10;

export function FreeParctOmniDirect() {
  Parct.Clear();
}

export function initParctOmniDirect() {
  let MtlNo2 = material.add(material.set(
    ...Matlib.Obsidian,
    [Tex.create("moon.png"), -1, -1, -1, -1, -1, -1, -1],
    0,
    "texture"
  ));

  Pr_ball = prim.create_sphere(5, 5, 0.5, MtlNo2)
  Parct = new ParcticleList([], [], 0);
  Parct.Clear();
}



export function renderParctOmniDirect() {
  
  f = f + (r * myTimer.globalDeltaTime)

  if (f > 1){
    //f -= GenerateSphere(Parct, mu_s, delts_s, myTimer.globalDeltaTime, p, Angle, R, Math.floor(f))
    f -= GenerateDirect(Parct, mu_s, delts_s, myTimer.globalDeltaTime, _vec3.set(p.x, p.y, getRandomArbitary(-70, -30)), w, 80, Math.floor(f))
  }
  Parct.TestAndDeatactivate(myTimer.globalDeltaTime);
  //Parct.ComputeAccelerations();
  Parct.Display();
 Parct.IntegrateFall(myTimer.globalDeltaTime)
}
