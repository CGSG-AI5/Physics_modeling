import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { cam } from "../math/mathcam.js";


let Pr;

export function initLines() {
  let Mtl1 = material.set(
    ...Matlib.Ruby,
    [-1, -1, -1, -1, -1, -1, -1, -1],
    0,
    "texture"
  );
let Vrts = [], Ind = [];
  Vrts[0] = new vertex(
    _vec3.set(0.5, 0, 0),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  
  Vrts[1] = new vertex(
    _vec3.set(-0.5, 0, 0),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Ind = [0, 1];

  Pr = prim.create(Vrts, Vrts.length, Ind, Ind.length, material.add(Mtl1))
  // floor.push(new Unit_plane(prim.create_plane(2, 2, material.add(Mtl)), new body_infinite_plane(_vec3.set(0, 0, -10), _vec3.set(0, 1, 0)), _vec3.set(0, 0, 0)))
  
}

export function renderLines() {
  let Dist = _vec3.len(_vec3.sub(cam.At, cam.Loc));
  let cosT, sinT, cosP, sinP, plen, Azimuth, Elevator;

  cosT = (cam.Loc.y - cam.At.y) / Dist;
  sinT = Math.sqrt(1 - cosT * cosT);

  plen = Dist * sinT;
  cosP = (cam.Loc.z - cam.At.z) / plen;
  sinP = (cam.Loc.x - cam.At.x) / plen;

  Azimuth = (Math.atan2(sinP, cosP) / Math.PI) * 180;
  Elevator = (Math.atan2(sinT, cosT) / Math.PI) * 180;
  
    let Worl = _matr4.mulmatr(_matr4.mulmatr(_matr4.scale(_vec3.set(_vec3.len(_vec3.sub(cam.Loc, cam.At)) / 2, 1, 1)), _matr4.mulmatr(_matr4.rotateY(Azimuth - 90), _matr4.rotateZ(0))),
     _matr4.translate(_vec3.divnum(_vec3.add(cam.Loc, cam.At), 2)));

    //console.log(_vec3.divnum(_vec3.add(cam.Loc, cam.At), 2), cam.At);
    // let cdvig = _vec3.mulnum(_vec3.add(cam.Loc, cam.At), 0.5)
    // console.log(_vec3.equel(cdvig, _vec3.set(80, 50, -50))) 

    // let Worl = _matr4.mulmatr(_matr4.scale(_vec3.set(_vec3.len(_vec3.sub(cam.Loc, cam.At)) / 2, 1, 1)), _matr4.translate(cdvig));
    prim.draw(Pr, Worl);
}
