import { _vec3 } from "../math/mathvec3.js";
import { gaussianRandom, getRandomArbitary, directionVectorInSphere, directionVectorAngulOfsetNormal, distributedNormalPosition} from "../math/mathrandom.js";
import { _matr4, D2R } from "../math/mathmat4.js";
import {  AddParcticleFromVoxelGrid, UpdateVoxelSizeCell } from "./voxel.js";

export function GenerateOmniDirect(Parcticle, mu_s, delta_s, dt, p, n){
    let NumParcticle = n;
    let Activate = [];
    if (Parcticle.InActiveCount < n) NumParcticle = Parcticle.InActiveCount
    for(let i = 0; i < NumParcticle; i++){
        let s = gaussianRandom(mu_s, delta_s / 3)
        let Vn = directionVectorInSphere();
        let time_create = getRandomArbitary(0, 1);
        let pn = _vec3.add(p, _vec3.mulnum(Vn, time_create * dt))

        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.center_of_mass = pn;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.V = _vec3.mulnum(Vn, s); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.a = _vec3.set1(0); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].IsActive = true;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].TimeLive = 0;
        Activate.push(Parcticle.InActiveStack.length - 1 - i);
    }
    for (let i = 0; i < Activate.length; i++)
    {
        Parcticle.InActiveStack.splice(Activate[i], 1)
    }
    Parcticle.InActiveCount -= Activate.length;
    return Activate.length;
}

export function GenerateDirect(Parcticle, mu_s, delta_s, dt, p, w, Angle, n){
    let NumParcticle = n;
    let Activate = [];
    if (Parcticle.InActiveCount < n) NumParcticle = Parcticle.InActiveCount
    for(let i = 0; i < NumParcticle; i++){
        let s = gaussianRandom(mu_s, delta_s / 3)
        let Vn = directionVectorAngulOfsetNormal(w, D2R(Angle));
        //let Vn = directionVectorInSphere();
        let time_create = getRandomArbitary(0, 1);
        let pn = _vec3.add(p, _vec3.mulnum(Vn, time_create * dt))
        let m = gaussianRandom(1000000000000, 900000000000 / 3);
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.center_of_mass = pn;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.V = _vec3.mulnum(Vn, s); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.a = _vec3.set1(0); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].IsActive = true;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.invm = m;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.scale = m / 1000000000000;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].TimeLive = 0;
        Activate.push(Parcticle.InActiveStack.length - 1 - i);
    }
    for (let i = 0; i < Activate.length; i++)
    {
        Parcticle.InActiveStack.splice(Activate[i], 1)
    }
    Parcticle.InActiveCount -= Activate.length;
    return Activate.length;
}

export function GenerateDisk(Parcticle, mu_s, delta_s, dt, p, w, Angle, R, n){
    let NumParcticle = n;
    let Activate = [];
    if (Parcticle.InActiveCount < n) NumParcticle = Parcticle.InActiveCount
    for(let i = 0; i < NumParcticle; i++){
        let s = gaussianRandom(mu_s, delta_s / 3)
        let Vn = directionVectorAngulOfsetNormal(w, D2R(Angle));
        let pn = distributedNormalPosition(p, w, R)
        let time_create = getRandomArbitary(0, 1);
        pn = _vec3.add(pn, _vec3.mulnum(Vn, time_create * dt))

        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.center_of_mass = pn;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.V = _vec3.mulnum(Vn, s); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.a = _vec3.set1(0); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].IsActive = true;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].TimeLive = 0;
        Activate.push(Parcticle.InActiveStack.length - 1 - i);
    }
    for (let i = 0; i < Activate.length; i++)
    {
        Parcticle.InActiveStack.splice(Activate[i], 1)
    }
    Parcticle.InActiveCount -= Activate.length;
    return Activate.length;
}

export function GenerateTriangle(Parcticle, mu_s, delta_s, dt, p, w, Angle, n){
    let NumParcticle = n;
    let Activate = [];
    if (Parcticle.InActiveCount < n) NumParcticle = Parcticle.InActiveCount
    for(let i = 0; i < NumParcticle; i++){
        let s = gaussianRandom(mu_s, delta_s / 3)
        let Vn = directionVectorAngulOfsetNormal(w, D2R(Angle));
        
        let u = 1, v = 1;
        
        while (u + v > 1){
            u = getRandomArbitary(0, 1);
            v = getRandomArbitary(0, 1);
        }
        let pn = _vec3.add(_vec3.add(_vec3.mulnum(p[0], u), _vec3.mulnum(p[1], v)), _vec3.mulnum(p[2], (1 - u - v)))
        let time_create = getRandomArbitary(0, 1);
        pn = _vec3.add(pn, _vec3.mulnum(Vn, time_create * dt))
        
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.center_of_mass = pn;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.V = _vec3.mulnum(Vn, s); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.a = _vec3.set1(0); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].IsActive = true;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].TimeLive = 0;
        Activate.push(Parcticle.InActiveStack.length - 1 - i);
    }
    for (let i = 0; i < Activate.length; i++)
    {
        Parcticle.InActiveStack.splice(Activate[i], 1)
    }
    Parcticle.InActiveCount -= Activate.length;
    return Activate.length;
}

export function GenerateSphere(Parcticle, mu_s, delta_s, dt, p, Angle, R, n){
    let NumParcticle = n;
    let Activate = [];
    if (Parcticle.InActiveCount < n) NumParcticle = Parcticle.InActiveCount
    for(let i = 0; i < NumParcticle; i++){
        let s = gaussianRandom(mu_s, delta_s / 3)
        let u = directionVectorInSphere();
        let Vn = directionVectorAngulOfsetNormal(u, D2R(Angle));

        
        let t  = getRandomArbitary(0, 1);
        let pn = _vec3.add(p, _vec3.mulnum(u, Math.cbrt(t) * R));

        let time_create = getRandomArbitary(0, 1);
        pn = _vec3.add(pn, _vec3.mulnum(Vn, time_create * dt))
        let m = gaussianRandom(100000000000, 90000000000 / 3);
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.center_of_mass = pn;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.V = _vec3.mulnum(Vn, s); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.a = _vec3.set1(0); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].IsActive = true;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.invm = m;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.scale = m / 100000000000;
        console.log(m / 10000000000);
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].TimeLive = 0;
        Activate.push(Parcticle.InActiveStack.length - 1 - i);
    }
    for (let i = 0; i < Activate.length; i++)
    {
        Parcticle.InActiveStack.splice(Activate[i], 1)
    }
    Parcticle.InActiveCount -= Activate.length;
    return Activate.length;
}


export function GenerateCube(Parcticle, p,  mu_s, delts_s, D, W, H, n){
    let NumParcticle = n;
    let Activate = [];
    let MaxBB, MinBB;
    if (Parcticle.InActiveCount < n) NumParcticle = Parcticle.InActiveCount
    for(let i = 0; i < NumParcticle; i++){
        let pn =  _vec3.add(p ,_vec3.set(getRandomArbitary(0, D), getRandomArbitary(0, W), getRandomArbitary(0, H)))

        let s = gaussianRandom(mu_s, delts_s / 3)
        let Vn = directionVectorInSphere();
        let m = gaussianRandom(100000000000, 90000000000 / 3);
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.center_of_mass = pn;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.V = _vec3.mulnum(Vn, s); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.a = _vec3.set1(0); 
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.invm = m;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].body.scale = m / 100000000000;
        console.log(m / 1000000000);
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].IsActive = true;
        Parcticle.ParcticleStack[Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i]].TimeLive = 0;
        //AddParcticleFromVoxelGrid(pn, Parcticle.InActiveStack[Parcticle.InActiveStack.length - 1 - i], 1)
        if (i == 0){
            MaxBB = _vec3.setvec3(pn);
            MinBB = _vec3.setvec3(pn);
          }  
          if (MinBB.z > pn.z){
            MinBB.z = pn.z
          }
          if (MinBB.x > pn.x){
            MinBB.x = pn.x
          }
          if (MinBB.y > pn.y){
            MinBB.y = pn.y
          }
      
          if (MaxBB.z < pn.z){
            MaxBB.z = pn.z
          }
          if (MaxBB.x < pn.x){
            MaxBB.x = pn.x
          }
          if (MaxBB.y < pn.y){
            MaxBB.y = pn.y
          }
        Activate.push(Parcticle.InActiveStack.length - 1 - i);
    }
    //UpdateVoxelSizeCell(MaxBB, MinBB);
    for (let i = 0; i < Activate.length; i++)
    {
        Parcticle.InActiveStack.splice(Activate[i], 1)
    }
    Parcticle.InActiveCount -= Activate.length;
    return Activate.length;
}
