import { _vec3 } from "../math/mathvec3.js";
import { Dwind, Vwind, elastic, friction} from "../main.js";
import { myTimer } from "../timer.js";
import { floor } from "../units/u_floor.js";


let d = 0;
let wind = _vec3.set1(0);
let distn = 0;
let distn1 = 0;
let e = 1;
let mu = 0;
let f = 1;
let IsColision = false;
let plane = [];

export class body_sphere{
    constructor(center_of_mass, V, R, invm, IsState){
        this.center_of_mass = center_of_mass;
        this.V = V;
        this.R = R;
        this.invm = invm;
        this.IsState = IsState;
    }
}

export class body_infinite_plane{
  constructor(center_of_mass, n){
      this.center_of_mass = center_of_mass;
      this.n = n;
  }
}

function Integrate(body, dt){
  let Vn = _vec3.set(body.V.x, body.V.y, body.V.z)
  let a = _vec3.add(g, _vec3.mulnum(_vec3.sub(wind, Vn), d * body.invm))

  body.V = _vec3.add(body.V, _vec3.mulnum(a, dt))

  let Vitog = _vec3.mulnum(_vec3.add(Vn, body.V), 0.5)


  body.center_of_mass = _vec3.add(body.center_of_mass, _vec3.mulnum(Vitog, dt))
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
    console.log(_vec3.dot(sphere.V, floor.n), _vec3.dot(sphere.V, floor.n) * (-e), _vec3.mulnum(floor.n, _vec3.dot(sphere.V, floor.n) * (-e)))
  }



  // distn1 = 0;
}

let g = _vec3.set(0, -10, 0)

export function fall(body){
  if (d != Dwind || !_vec3.equel(wind, Vwind) || e != elastic || mu != friction){
    d = Dwind;
    e = parseFloat(elastic);
    mu = parseFloat(friction);
    wind = _vec3.set(Number(Vwind.x), Number(Vwind.y), Number(Vwind.z))
    body.V = _vec3.set(10, 0, 0)
    body.center_of_mass = _vec3.set(-10, 15, -10)
    body.IsState = 0;
  }
  IsColision = false;
  plane = [];
  f = 1;

  Integrate(body, myTimer.globalDeltaTime)

  for (let i = 0; i < floor.length; i++){
    CollisionBettween(body, floor[i].body)
  }

  if (IsColision){
    Integrate(body, -myTimer.globalDeltaTime);
    let Vn = _vec3.set(body.V.x, body.V.y, body.V.z)
    let a = _vec3.add(g, _vec3.mulnum(_vec3.sub(wind, Vn), d * body.invm))
  
  
    body.V = _vec3.add(body.V, _vec3.mulnum(a, f * myTimer.globalDeltaTime))
    let Vitog = _vec3.mulnum(_vec3.add(Vn, body.V), 0.5)
  
    body.center_of_mass = _vec3.add(body.center_of_mass, _vec3.mulnum(Vitog, f * myTimer.globalDeltaTime))

    for (let i = 0; i < plane.length; i++){
      CollisionResponse(body, plane[i])
    }
  }

}
