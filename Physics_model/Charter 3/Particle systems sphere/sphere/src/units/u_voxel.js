import { prim, vertex } from "../rnd/prim.js";
import { _vec3 } from "../math/mathvec3.js";
import { material, Matlib } from "../rnd/res/material.js";
import { _matr4 } from "../math/mathmat4.js";
import { myInput } from "../input.js";
import { Tex } from "../rnd/res/texture.js";
import { body_attractor_line } from "../physic/phisics1.js";
import { PosVoxelGrid, VoxelDepth, VoxelHight, VoxelSizeCell, VoxelWeight} from "../rnd/voxel.js";



let Vox = [];

let Pr1;
let Pr2;
let Pr3;

class Unit_Vox {
    constructor (Pr, P, scale){
        this.Pr = Pr;
        this.P = P;
        this.scale = scale;
    }
}

export function initVox() {

  let Mtl;
  Mtl = material.set(
    ...Matlib.Obsidian,
    [-1, -1, -1, -1, -1, -1, -1, -1],
    0,
    "lines"
  );


  let Vrts = [], Ind = [];
  Vrts[0] = new vertex(
    _vec3.set(-0.5, 0, 0),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  
  Vrts[1] = new vertex(
    _vec3.set(0.5, 0, 0),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Ind = [0, 1];


  Pr1 = prim.create(Vrts, Vrts.length, Ind, Ind.length, material.add(Mtl))

  Vrts[0] = new vertex(
    _vec3.set(0, -0.5, 0),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  
  Vrts[1] = new vertex(
    _vec3.set(0, 0.5, 0),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Pr2 = prim.create(Vrts, Vrts.length, Ind, Ind.length, material.add(Mtl))

  Vrts[0] = new vertex(
    _vec3.set(0, 0, 0.5),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );
  
  Vrts[1] = new vertex(
    _vec3.set(0, 0, -0.5),
    _vec3.set(1.0, 0.3, 0.27),
    _vec3.set(0, 1, 0),
    _vec3.set(0, 0, 0)
  );

  Pr3 = prim.create(Vrts, Vrts.length, Ind, Ind.length, material.add(Mtl))




  for (let i = 0; i <= VoxelDepth; i++){
    for (let j = 0; j <= VoxelHight; j++){
        for (let k = 0; k <= VoxelWeight; k++){
            if (k == 0){
                Vox.push(new Unit_Vox(Pr1, _vec3.add(PosVoxelGrid, _vec3.mulnum(_vec3.set(VoxelWeight / 2, j, i), VoxelSizeCell)), _vec3.set(VoxelSizeCell * VoxelWeight, 1, 1)))
            }
            if (j == 0) {
                Vox.push(new Unit_Vox(Pr2, _vec3.add(PosVoxelGrid, _vec3.mulnum(_vec3.set(k, VoxelHight / 2, i), VoxelSizeCell)), _vec3.set(1, VoxelSizeCell * VoxelHight, 1)))
            }
            if (i == 0) {
                Vox.push(new Unit_Vox(Pr3, _vec3.add(PosVoxelGrid, _vec3.mulnum(_vec3.set(k, j, VoxelDepth / 2), VoxelSizeCell)), _vec3.set(1, 1, VoxelSizeCell * VoxelDepth)))
            }
        }
    } 
  }
}

export function renderVox() {
  Vox = [];
  for (let i = 0; i <= VoxelDepth; i++){
    for (let j = 0; j <= VoxelHight; j++){
        for (let k = 0; k <= VoxelWeight; k++){
            if (k == 0){
                Vox.push(new Unit_Vox(Pr1, _vec3.add(PosVoxelGrid, _vec3.mulnum(_vec3.set(VoxelWeight / 2, j, i), VoxelSizeCell)), _vec3.set(VoxelSizeCell * VoxelWeight, 1, 1)))
            }
            if (j == 0) {
                Vox.push(new Unit_Vox(Pr2, _vec3.add(PosVoxelGrid, _vec3.mulnum(_vec3.set(k, VoxelHight / 2, i), VoxelSizeCell)), _vec3.set(1, VoxelSizeCell * VoxelHight, 1)))
            }
            if (i == 0) {
                Vox.push(new Unit_Vox(Pr3, _vec3.add(PosVoxelGrid, _vec3.mulnum(_vec3.set(k, j, VoxelDepth / 2), VoxelSizeCell)), _vec3.set(1, 1, VoxelSizeCell * VoxelDepth)))
            }
        }
    } 
  }
    for (let i = 0; i < Vox.length; i++){
        let Worl = _matr4.mulmatr(_matr4.scale(Vox[i].scale), _matr4.translate(Vox[i].P))
        prim.draw(Vox[i].Pr, Worl);
    }

}