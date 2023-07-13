import { _matr4 } from "./mathmat4";
import { _vec3 } from "./mathvec3";


export function  getRandomArbitary(min, max){
    return Math.random() * (max - min) + min;
}

export function  getRandomInt(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function gaussianRandom(mean, stdev) {
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log(u)) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return z * stdev + mean;
}

export function directionVectorInSphere(){
    let phi = getRandomArbitary(-Math.PI, Math.PI);
    let y = getRandomArbitary(-1, 1)
    let r  = Math.sqrt(1  - y * y)
    return _vec3.set(r * Math.cos(phi), y, -r * Math.sin(phi))
} 

export function directionVectorAngulOfset(w, stdev){
    let a = _vec3.set(1, 0, 0);
    if (w.y == 0 && w.z == 0){
        a = _vec3.set(0, 1, 0);
    }
    let uz = _vec3.normalize(w);
    let ux = _vec3.normalize(_vec3.cross(a, uz))
    let uy = _vec3.normalize(_vec3.cross(uz, ux))
    let f = getRandomArbitary(0, 1);
    let phi = Math.sqrt(f) * stdev;
    let teta =  getRandomArbitary(-Math.PI, Math.PI);
    return _vec3.add(_vec3.add(_vec3.mulnum(ux, Math.cos(teta) * Math.sin(phi)), _vec3.mulnum(uy, Math.sin(teta) * Math.sin(phi))), _vec3.mulnum(uz, Math.cos(phi)))
}

export function directionVectorAngulOfsetNormal(w, stdev){
    let a = _vec3.set(1, 0, 0);
    if (w.y == 0 && w.z == 0){
        a = _vec3.set(0, 1, 0);
    }
    let uz = _vec3.normalize(w);
    let ux = _vec3.normalize(_vec3.cross(a, uz))
    let uy = _vec3.normalize(_vec3.cross(uz, ux))
    let f = gaussianRandom(0, stdev / 3);
    let phi = Math.sqrt(f) * stdev;
    let teta =  getRandomArbitary(-Math.PI, Math.PI);
    return _vec3.add(_vec3.add(_vec3.mulnum(ux, Math.cos(teta) * Math.sin(phi)), _vec3.mulnum(uy, Math.sin(teta) * Math.sin(phi))), _vec3.mulnum(uz, Math.cos(phi)))
}

export function distributedPosition(c, n, R){
    let a = _vec3.set(1, 0, 0);
    if (n.y == 0 && n.z == 0){
        a = _vec3.set(0, 1, 0);
    }
    let uz = _vec3.normalize(n);
    let ux = _vec3.normalize(_vec3.cross(a, uz))
    let uy = _vec3.normalize(_vec3.cross(uz, ux))
    let f = getRandomArbitary(0, 1);
    let r = Math.sqrt(f) * R;
    let teta =  getRandomArbitary(-Math.PI, Math.PI);
    return _vec3.add(
        _vec3.add(
            _vec3.add(_vec3.mulnum(ux, Math.cos(teta) * r), _vec3.mulnum(uy, Math.sin(teta) * r)), _vec3.set1(0)
        ), c
    )
}

export function distributedNormalPosition(c, n, R){
    let a = _vec3.set(1, 0, 0);
    if (n.y == 0 && n.z == 0){
        a = _vec3.set(0, 1, 0);
    }
    let uz = _vec3.normalize(n);
    let ux = _vec3.normalize(_vec3.cross(a, uz))
    let uy = _vec3.normalize(_vec3.cross(uz, ux))
    let f = getRandomArbitary(0, R / 3);
    let r = Math.sqrt(f) * R;
    let teta =  getRandomArbitary(-Math.PI, Math.PI);
    return _vec3.add(
        _vec3.add(
            _vec3.add(_vec3.mulnum(ux, Math.cos(teta) * r), _vec3.mulnum(uy, Math.sin(teta) * r)), _vec3.set1(0)
        ), c
    )
}