import { _vec3 } from "../math/mathvec3.js";
import { triangle } from "../units/u_triangle.js";
import { N } from "../units/u_parct_omni_direct.js";

export let VoxelGrid = new Array();
export let PosVoxelGrid = _vec3.set(-60, -10, -140)
export let VoxelSizeCell = 20;
export let VoxelDepth = Math.ceil(Math.sqrt(3) * Math.cbrt(Math.sqrt(N)));
export let VoxelWeight = Math.ceil(Math.sqrt(3) * Math.cbrt(Math.sqrt(N)));
export let VoxelHight = Math.ceil(Math.sqrt(3) * Math.cbrt(Math.sqrt(N)));

export function initVoxel(){
    let i_Array = [];
    for(let i = 0; i < VoxelDepth; i++){
        let j_Array = [];
        for (let j = 0; j < VoxelWeight; j++){
            let g_Array = [];
            for (let g = 0; g < VoxelHight; g++){
                g_Array.push(new Array(4))
                g_Array[g][0] = 0; 
                g_Array[g][1] = new Array(1001); 
                g_Array[g][2] = _vec3.set1(0); 
                g_Array[g][3] = 0; 
                
            }
            j_Array.push(g_Array)
        }
        i_Array.push(j_Array)
    }
    VoxelGrid = i_Array;
}

export function AddTriangleFromVoxelGrid(Vrts, index){
    let p0 = [Math.ceil((Vrts[0].z - PosVoxelGrid.z) / size), Math.ceil((Vrts[0].y - PosVoxelGrid.y + 0.8) / size), Math.ceil((Vrts[0].x - PosVoxelGrid.x) / size)]
    let p1 = [Math.ceil((Vrts[1].z - PosVoxelGrid.z) / size), Math.ceil((Vrts[1].y - PosVoxelGrid.y + 0.8) / size), Math.ceil((Vrts[1].x - PosVoxelGrid.x) / size)]
    let p2 = [Math.ceil((Vrts[2].z - PosVoxelGrid.z) / size), Math.ceil((Vrts[2].y - PosVoxelGrid.y + 0.8) / size), Math.ceil((Vrts[2].x - PosVoxelGrid.x) / size)]
    
    let pmin = Math.min(p0[0], p1[0], p2[0])
    let pmax = Math.max(p0[0], p1[0], p2[0])

    let rmin = Math.min(p0[1], p1[1], p2[1])
    let rmax = Math.max(p0[1], p1[1], p2[1])

    let cmin = Math.min(p0[2], p1[2], p2[2])
    let cmax = Math.max(p0[2], p1[2], p2[2])

    for (let i = pmin; i <= pmax; i++){
        for (let j = rmin; j <= rmax; j++){
            for (let k = cmin; k <= cmax; k++){
                VoxelGrid[i][j][k] = index;
            }
        }        
    }
}

export function AddParcticleFromVoxelGrid(Pos, index, m){
  let d = Math.floor((Pos.z - PosVoxelGrid.z) / VoxelSizeCell), 
  h = Math.floor((Pos.y - PosVoxelGrid.y) / VoxelSizeCell),
  w = Math.floor((Pos.x - PosVoxelGrid.x) / VoxelSizeCell)
  console.log(Pos, d, h, w)
  if (d < 0 || h < 0 || w < 0)
  console.log(1);
  if (VoxelGrid[d][h][w][0] == 0){
    VoxelGrid[d][h][w][0]++;
    VoxelGrid[d][h][w][1][0] = index;
    VoxelGrid[d][h][w][2] = Pos;
    VoxelGrid[d][h][w][3] = m;
    
  }
  else{
    VoxelGrid[d][h][w][0]++;
    VoxelGrid[d][h][w][1][VoxelGrid[d][h][w][0] - 1] = index;
    VoxelGrid[d][h][w][2] = _vec3.divnum(_vec3.add(_vec3.mulnum(VoxelGrid[d][h][w][2], VoxelGrid[d][h][w][3]), _vec3.mulnum(Pos, m)), VoxelGrid[d][h][w][3] + m);
    VoxelGrid[d][h][w][3] += m;
  }
}

export function ClearVoxelGrid(){
    for (let i = 0; i < VoxelDepth; i++){
      for (let j = 0; j < VoxelHight; j++){
        for (let k = 0; k < VoxelWeight; k++){
          VoxelGrid[i][j][k][0] = 0;
        }
      }   
    }
}
export function UpdateVoxelSizeCell(MaxBB, MinBB){
    let d = Math.ceil((MaxBB.z - MinBB.z) / VoxelDepth);
    let h = Math.ceil((MaxBB.y - MinBB.y) / VoxelHight);
    let w = Math.ceil((MaxBB.x - MinBB.x) / VoxelWeight);
    VoxelSizeCell = Math.max(d, h, w);
    PosVoxelGrid = MinBB;
    console.log("BB: ",MinBB, MaxBB)
}

export function InVoxel(Pos){
    if(Pos.x > PosVoxelGrid.x && Pos.x < PosVoxelGrid.x + VoxelWeight * VoxelSizeCell &&
        Pos.y > PosVoxelGrid.y && Pos.y < PosVoxelGrid.y + VoxelHight * VoxelSizeCell &&
        Pos.z > PosVoxelGrid.z && Pos.z < PosVoxelGrid.z + VoxelDepth * VoxelSizeCell){
            return true;
        } 
    
    return false; 
}

export function DetectIntersectVoxel(xn, xn1){
    let p0 = [Math.ceil((xn.z - PosVoxelGrid.z) / size), Math.ceil((xn.y - PosVoxelGrid.y) / size), Math.ceil((xn.x - PosVoxelGrid.x) / size)]
    let p1 = [Math.ceil((xn1.z - PosVoxelGrid.z) / size), Math.ceil((xn1.y - PosVoxelGrid.y) / size), Math.ceil((xn1.x - PosVoxelGrid.x) / size)]

    let pmin = Math.min(p0[0], p1[0])
    let pmax = Math.max(p0[0], p1[0])

    let rmin = Math.min(p0[1], p1[1])
    let rmax = Math.max(p0[1], p1[1])

    let cmin = Math.min(p0[2], p1[2])
    let cmax = Math.max(p0[2], p1[2])

    let TriangleIndex = []

    for (let i = pmin; i <= pmax; i++){
        for (let j = rmin; j <= rmax; j++){
            for (let k = cmin; k <= cmax; k++){
                if (VoxelGrid[i][j][k] != -1 && (TriangleIndex.length == 0 || !TriangleIndex.includes(VoxelGrid[i][j][k])))
                    TriangleIndex.push(VoxelGrid[i][j][k]);
            }
        }        
    }
    return TriangleIndex
}