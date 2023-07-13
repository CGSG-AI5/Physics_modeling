import { _vec3 } from "../math/mathvec3.js";
import { Dwind, Vwind} from "../main.js";
import { myTimer } from "../timer.js";


let d = 0;
let wind = _vec3.set1(0);

export class body_sphere{
    constructor(center_of_mass, V, R, invm){
        this.center_of_mass = center_of_mass;
        this.V = V;
        this.R = R;
        this.invm = invm;
    }
}

let g = _vec3.set(0, -10, 0)

export function fall(body){
  if (d != Dwind || !_vec3.equel(wind, Vwind)){
    d = Dwind;
    wind = _vec3.set(Number(Vwind.x), Number(Vwind.y), Number(Vwind.z))
    body.V = _vec3.set(10, 0, 0)
    body.center_of_mass = _vec3.set(-10, 15, -10)
  }
  let Vn = _vec3.set(body.V.x, body.V.y, body.V.z)
  let a = _vec3.add(g, _vec3.mulnum(_vec3.sub(wind, Vn), d * body.invm))

  body.V = _vec3.add(body.V, _vec3.mulnum(a, myTimer.globalDeltaTime))
  console.log(body.V);
  let Vitog = _vec3.mulnum(_vec3.add(Vn, body.V), 0.5)

  body.center_of_mass = _vec3.add(body.center_of_mass, _vec3.mulnum(Vitog, myTimer.globalDeltaTime))
}
