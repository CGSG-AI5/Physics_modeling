import { _vec3 } from "../math/mathvec3.js";
import { Dwind, Vwind, elastic, friction} from "../main.js";
import { myTimer } from "../timer.js";
import { floor } from "../units/u_floor.js";
import { DetectIntersectVoxel, PosVoxelGrid, UpdateVoxelSizeCell, VoxelDepth, VoxelGrid, VoxelHight, VoxelSizeCell, VoxelWeight } from "../rnd/voxel.js";
import { triangle } from "../units/u_triangle.js";
import { Planet } from "../units/u_attractor_sphere.js";
import { PlanetLine } from "../units/u_attractor_line.js";
import { directionVectorInSphere, getRandomArbitary } from "../math/mathrandom.js";
import { VorticesList } from "../units/u_vortices.js";


let d = 0;
let wind = _vec3.set1(0);
let distn = 0;
let distn1 = 0;
let e = 1;
let mu = 0;
let f = 1;
let IsColision = false;
let plane = [];
let G = 0.0000000000667;

export class body_sphere{
    constructor(center_of_mass, V, a, R, invm, scale){
        this.center_of_mass = center_of_mass;
        this.V = V;
        this.a = a;
        this.R = R;
        this.invm = invm;
        this.scale = scale;
    }
}

export class body_infinite_plane{
  constructor(center_of_mass, n){
      this.center_of_mass = center_of_mass;
      this.n = n;
  }
}

export class body_attractor_sphere{
  constructor(center_of_mass, G, p, R, Rp){
      this.center_of_mass = center_of_mass;
      this.G = G;
      this.p = p;
      this.R = R;
      this.Rp = Rp;
  }
}

export class body_attractor_line{
  constructor(center_of_mass, a, L, G, p){
      this.center_of_mass = center_of_mass;
      this.a = a;
      this.L = L;
      this.G = G;
      this.p = p;
  }
}

export class body_vortices{
  constructor(center_of_mass, a, L, R, Fr){
    this.center_of_mass =center_of_mass;
    this.a = a;
    this.L = L;
    this.R = R;
    this.Fr = Fr;
  } 
}

function VelocityLimeters(Vn){
  let Vmin = 0;
  let Vmax = 100;
  return _vec3.mulnum(_vec3.normalize(Vn), Math.min(Math.max(_vec3.len(Vn), Vmin), Vmax)) 
}

function VelocityOffset(Vitog, dv){
  return _vec3.add(Vitog, _vec3.mulnum(dv, myTimer.globalDeltaTime))
}

function VelocityRotate(Vitog, u, angle){
    return _vec3.rotate_vector(Vitog, u, angle)
}

function Vortices (body){
  for (let i = 0; i < VorticesList.length; i++){
    let x_vi = _vec3.sub(body.center_of_mass, VorticesList[i].body.center_of_mass);
    let l = _vec3.dot(VorticesList[i].body.a, x_vi);
    if (l <=  VorticesList[i].body.L && l >= 0){
      let r = _vec3.sub(x_vi, _vec3.mulnum(VorticesList[i].body.a, l));
      if (_vec3.len(r) <= VorticesList[i].body.R){
        let f = Math.min(100, VorticesList[i].body.R / _vec3.len(r) * VorticesList[i].body.Fr);
        body.V =  VelocityRotate(body.V, VorticesList[i].body.a, f * 360 * myTimer.globalDeltaTime)
      }
    }
  }
}

function Integrate(body, dt){
  let Vn = _vec3.set(body.V.x, body.V.y, body.V.z)
  
  let Vn1 = _vec3.add(body.V, _vec3.mulnum(body.a, dt))
  Vn1 = VelocityLimeters(Vn1);

  body.V = _vec3.setvec3(Vn1);

  //Vortices(body);

  let Vitog = _vec3.mulnum(_vec3.add(Vn, body.V), 0.5)

  let xn = body.center_of_mass;

  let xn1 = _vec3.add(body.center_of_mass, _vec3.mulnum(Vitog, dt))




  // let TriangleList = DetectIntersectVoxel(xn, xn1)

  // for (let i = 0; i < TriangleList.length; i++){
  //   let dn1 = _vec3.dot(_vec3.sub(xn1, triangle[TriangleList[i]].p), triangle[TriangleList[i]].n)


  //   xn1 =  _vec3.sub(xn1, _vec3.mulnum(floor[i].body.n, (1 + e) * (dn1)))


  //   let Vnorm = _vec3.mulnum(triangle[TriangleList[i]].n, _vec3.dot(Vn1, triangle[TriangleList[i]].n))
  //   let Vt = _vec3.sub(Vn1, Vnorm)
  //   Vn1 = _vec3.add(_vec3.mulnum(Vnorm, -e), _vec3.mulnum(Vt, (1 - f)))
  // }

  // for (let i = 0; i < floor.length; i++)
  // {
  //   let dn = _vec3.dot(_vec3.sub(xn, floor[i].body.center_of_mass), floor[i].body.n)
  //   let dn1 = _vec3.dot(_vec3.sub(xn1, floor[i].body.center_of_mass), floor[i].body.n)

  //   if ((dn >= body.R && dn1 < body.R) || (dn <= -body.R && dn1 > -body.R))
  //   {
  //     xn1 =  _vec3.sub(xn1, _vec3.mulnum(floor[i].body.n, (1 + e) * (dn1 - (body.R * Math.sign(dn)))))
  //     let Vnorm = _vec3.mulnum(floor[i].body.n, _vec3.dot(Vn1, floor[i].body.n))
  //     let Vt = _vec3.sub(Vn1, Vnorm)
  //     Vn1 = _vec3.add(_vec3.mulnum(Vnorm, -e), _vec3.mulnum(Vt, (1 - f)))
  //   }
  // }
  //body.V = _vec3.setvec3(Vn1)
  body.center_of_mass = _vec3.setvec3(xn1)
}

function CollisionBettween(sphere, floor){
  distn1 = _vec3.dot(_vec3.sub(sphere.center_of_mass, floor.center_of_mass), floor.n) - sphere.R;
  if (distn1 < 0){

    Integrate(sphere, -myTimer.globalDeltaTime);
    distn = _vec3.dot(_vec3.sub(sphere.center_of_mass, floor.center_of_mass), floor.n) - sphere.R;
    plane.push(floor);
    IsColision = true;
    if (f > distn / (-distn1 + distn)){
      f = distn / (-distn1 + distn);
    }
    Integrate(sphere, myTimer.globalDeltaTime);
  }
}

function CollisionResponse(sphere, floor){
  let z = _vec3.dot(sphere.V, floor.n) * (-e);
  let Vnorm = _vec3.mulnum(floor.n, z);
  let Vt = _vec3.sub(sphere.V, _vec3.mulnum(floor.n, _vec3.dot(sphere.V, floor.n)));
  Vt = _vec3.sub(Vt, _vec3.mulnum(_vec3.normalize(Vt), Math.min(mu *
                 _vec3.len(_vec3.mulnum(floor.n, _vec3.dot(sphere.V, floor.n))), _vec3.len(Vt))))


  
  sphere.V = _vec3.add(Vnorm, Vt);
  // sphere.center_of_mass = _vec3.add(sphere.center_of_mass, _vec3.mulnum(sphere.V,(1 - f) * myTimer.globalDeltaTime))

  if(sphere.V.y < 0 && _vec3.dot(_vec3.sub(sphere.center_of_mass, floor.center_of_mass), floor.n) - sphere.R < 0.01){
    //sphere.IsState = 1;
    //console.log(_vec3.dot(sphere.V, floor.n), _vec3.dot(sphere.V, floor.n) * (-e), _vec3.mulnum(floor.n, _vec3.dot(sphere.V, floor.n) * (-e)))
  }



  // distn1 = 0;
}

let g = _vec3.set(0, -10, 0)
function AttrractorLine(body){
  for (let i = 0; i < PlanetLine.length; i++){
    let xa = _vec3.sub(PlanetLine[i].body.center_of_mass, _vec3.mulnum(PlanetLine[i].body.a, PlanetLine[i].body.L))
    let dist = _vec3.sub(body.center_of_mass, xa)
    let l  =_vec3.dot(dist, PlanetLine[i].body.a)

    let r;
    if (l > PlanetLine[i].body.L){
      r  = _vec3.sub(body.center_of_mass, _vec3.add(xa, _vec3.mulnum(PlanetLine[i].body.a, PlanetLine[i].body.L)))
    }
    else if(l < 0){
      r = _vec3.setvec3(dist);
    }
    else{
      r = _vec3.sub(dist, _vec3.mulnum(PlanetLine[i].body.a, l))
    }
    let x = _vec3.normalize(r);
    body.a = _vec3.add(body.a, _vec3.mulnum(x, -PlanetLine[i].body.G * 1 / Math.pow(_vec3.len(r), PlanetLine[i].body.p)));
  }
}

function AttrractorSphere(body){
  for (let i = 0; i < Planet.length; i++){
    let r = _vec3.len(_vec3.sub(body.center_of_mass, Planet[i].body.center_of_mass));
    let x = _vec3.divnum(_vec3.sub(body.center_of_mass, Planet[i].body.center_of_mass), r);
    body.a =_vec3.add(body.a, _vec3.mulnum(x, -Planet[i].body.G * 1 / Math.pow(r, Planet[i].body.p)));
  }
}

function RandomAccelerations(body){
  let smax = 1;
  let s = getRandomArbitary(0, smax);
  body.a =_vec3.add(body.a, _vec3.mulnum(directionVectorInSphere(), s / myTimer.globalDeltaTime))
}

function DraugAccelerations(body){
  let w = _vec3.set(0, 1, -1);
  let d = 0.5;
  body.a =_vec3.add(body.a, _vec3.mulnum(_vec3.sub(w, body.V), d * body.invm))
}

function SteeringAccelerations(body){
  for (let i = 0; i < Planet.length; i++){
    let R = Planet[i].body.R + Planet[i].body.Rp;
    let time_reactions = 10;
    let V_dist = _vec3.sub(Planet[i].body.center_of_mass, body.center_of_mass);
    let Dist_collision_points = _vec3.dot(_vec3.normalize(body.V), V_dist)
    if (_vec3.len(_vec3.sub(body.center_of_mass, _vec3.set(0, 50, -80))) < 40){
      console.log(1)
    }
    if (Dist_collision_points >= 0){
      let dist_current = _vec3.len(body.V) * time_reactions;
      if (Dist_collision_points <= dist_current ){
        let V_collision_points = _vec3.add(body.center_of_mass, _vec3.mulnum(_vec3.normalize(body.V), Dist_collision_points))
        let Dist_betwen_collision_points_and_center_of_mass_sphere = _vec3.len(_vec3.sub(V_collision_points, Planet[i].body.center_of_mass))
        if (Dist_betwen_collision_points_and_center_of_mass_sphere <= R){
          let V_body_ortogonal_normalize = _vec3.normalize(_vec3.sub(V_collision_points, Planet[i].body.center_of_mass))
          let V_turning_target = _vec3.add(Planet[i].body.center_of_mass, _vec3.mulnum(V_body_ortogonal_normalize, Planet[i].body.R));
          let Dist_turning_target = _vec3.len(V_turning_target, body.center_of_mass);
          let Velocity_to_turning_target = _vec3.dot(body.V, _vec3.sub(V_turning_target, body.center_of_mass))  / Dist_turning_target
          let time_to_turning_target = Dist_turning_target / Velocity_to_turning_target;
          let Delts_body_v = _vec3.len(_vec3.cross(_vec3.normalize(body.V), _vec3.sub(V_turning_target, body.center_of_mass))) / time_to_turning_target;
          let Accelerations_num = 2 * Delts_body_v / time_to_turning_target;
          body.a = _vec3.add(body.a, _vec3.mulnum(V_body_ortogonal_normalize, Math.max(0, Accelerations_num - _vec3.dot(body.a, V_body_ortogonal_normalize))))
        }
      }
    }
  }
}

export function UpdateAccelerations(body){
  body.a = _vec3.set1(0)
  //AttrractorLine(body);
  AttrractorSphere(body);
  SteeringAccelerations(body);
  //RandomAccelerations(body);
  //body.a = _vec3.add(g, _vec3.mulnum(_vec3.sub(wind, body.V), d * body.invm))
}

function AttrractorSphereStateVector(P, a){
  for (let i = 0; i < Planet.length; i++){
    let r = _vec3.len(_vec3.sub(P, Planet[i].body.center_of_mass));
    let x = _vec3.divnum(_vec3.sub(P, Planet[i].body.center_of_mass), r);
    a = _vec3.add(a, _vec3.mulnum(x, -Planet[i].body.G * 1 / Math.pow(r, Planet[i].body.p)));
  }
  return a;
}


export function UpdateAccelerationsStateVector(State_Vector, State_Vector_derivative, ParcticleStack){
  let a = _vec3.set1(0);
  for (let i = 0; i < State_Vector[0]; i++){
    State_Vector_derivative[i * 2 + 1] = a;
    State_Vector_derivative[i * 2 + 1] = AttrractorSphereStateVector(State_Vector[i * 3 + 2], a);
  }
  for (let i = 0; i < State_Vector[0]; i++){
    let d = Math.floor((State_Vector[i * 3 + 2].z - PosVoxelGrid.z) / VoxelSizeCell), 
    h = Math.floor((State_Vector[i * 3 + 2].y - PosVoxelGrid.y) / VoxelSizeCell),
    w = Math.floor((State_Vector[i * 3 + 2].x - PosVoxelGrid.x) / VoxelSizeCell)

    for(let r = 0; r < VoxelDepth; r++){
      for(let j = 0; j < VoxelHight; j++){
        for(let k = 0; k < VoxelWeight; k++){
          if(r >= d - 1 && r <= d + 1 && j >= h - 1 && j <= h + 1 && k >= w - 1 && k <= w + 1){
            for (let q = 0; q < VoxelGrid[r][j][k][0]; q++){
              let index = VoxelGrid[r][j][k][1][q];
              if (index  !=  State_Vector[i * 3 + 1]){
                let R = Math.min(0.0, _vec3.len(_vec3.sub(ParcticleStack[index].body.center_of_mass, State_Vector[i * 3 + 2])))
                if (R > 0.0){
                  State_Vector_derivative[i * 2 + 1] = _vec3.add(State_Vector_derivative[i * 2 + 1], _vec3.mulnum(_vec3.normalize(_vec3.sub(ParcticleStack[index].body.center_of_mass, State_Vector[i * 3 + 2])), G * ParcticleStack[index].body.invm / (R * R)))  
                }
              }
            }
          }
          else{
            let R = _vec3.len(_vec3.sub(VoxelGrid[r][j][k][2], State_Vector[i * 3 + 2]))
            State_Vector_derivative[i * 2 + 1] = _vec3.add(State_Vector_derivative[i * 2 + 1], _vec3.mulnum(_vec3.normalize(_vec3.sub(VoxelGrid[r][j][k][2], State_Vector[i * 3 + 2])), G * VoxelGrid[r][j][k][3] / (R * R)))
          }
        }
      }
    }
  }

  //body.a = _vec3.set1(0)
  //AttrractorLine(body);
  //AttrractorSphereStateVector(body);
  //SteeringAccelerations(body)
  //RandomAccelerations(body);
  //body.a = _vec3.add(g, _vec3.mulnum(_vec3.sub(wind, body.V), d * body.invm))
}


export function IntegrateStateVector(State_Vector, State_Vector_derivative){
  let MaxBB, MinBB;
  for (let i = 0; i < State_Vector[0]; i++){
    State_Vector[i * 3 + 2] = _vec3.add(State_Vector[i * 3 + 2], _vec3.mulnum(State_Vector_derivative[i * 2], myTimer.globalDeltaTime))  
    if (i == 0){
      MaxBB = _vec3.setvec3(State_Vector[i * 3 + 2]);
      MinBB = _vec3.setvec3(State_Vector[i * 3 + 2]);
    }  
    if (MinBB.z > State_Vector[i * 3 + 2].z){
      MinBB.z = State_Vector[i * 3 + 2].z
    }
    if (MinBB.x > State_Vector[i * 3 + 2].x){
      MinBB.x = State_Vector[i * 3 + 2].x
    }
    if (MinBB.y > State_Vector[i * 3 + 2].y){
      MinBB.y = State_Vector[i * 3 + 2].y
    }

    if (MaxBB.z < State_Vector[i * 3 + 2].z){
      MaxBB.z = State_Vector[i * 3 + 2].z
    }
    if (MaxBB.x < State_Vector[i * 3 + 2].x){
      MaxBB.x = State_Vector[i * 3 + 2].x
    }
    if (MaxBB.y < State_Vector[i * 3 + 2].y){
      MaxBB.y = State_Vector[i * 3 + 2].y
    }
    let Vmax = 10; 
    let Vn = _vec3.add(State_Vector[i * 3 + 3], _vec3.mulnum(State_Vector_derivative[i * 2 + 1], myTimer.globalDeltaTime))
    State_Vector[i * 3 + 3] = _vec3.mulnum(_vec3.normalize(Vn), Math.min(10000, _vec3.len(Vn)))
        
  }
  //UpdateVoxelSizeCell(MaxBB, MinBB);
}


export function fall(body){
  if (d != Dwind || !_vec3.equel(wind, Vwind) || e != elastic || mu != friction){
    d = Dwind;
    e = parseFloat(elastic);
    mu = parseFloat(friction);
    wind = _vec3.set(Number(Vwind.x), Number(Vwind.y), Number(Vwind.z))
    return true;
  }
  IsColision = false;
  plane = [];
  f = 1;



  Integrate(body, myTimer.globalDeltaTime)

  // for (let i = 0; i < floor.length; i++){
  //   CollisionBettween(body, floor[i].body)
  // }

  // if (IsColision){
  //   Integrate(body, -myTimer.globalDeltaTime);
  //   let Vn = _vec3.set(body.V.x, body.V.y, body.V.z)
  //   let a = _vec3.add(g, _vec3.mulnum(_vec3.sub(wind, Vn), d * body.invm))
  
  
  //   body.V = _vec3.add(body.V, _vec3.mulnum(a, f * myTimer.globalDeltaTime))
  //   let Vitog = _vec3.mulnum(_vec3.add(Vn, body.V), 0.5)
  
  //   body.center_of_mass = _vec3.add(body.center_of_mass, _vec3.mulnum(Vitog, f * myTimer.globalDeltaTime))

  //   for (let i = 0; i < plane.length; i++){
  //     CollisionResponse(body, plane[i])
  //   }
  // }
  // return false;
}
