import { UBO } from "./res/ubo.js";
import { gl } from "./rnddata.js";
import { shad } from "./res/shader.js";
import { _matr4 } from "../math/mathmat4.js";
import { _vec3 } from "../math/mathvec3.js";
import { cam } from "../math/mathcam.js";
import { CamUBO } from "./rndbase.js";
import { Ubo_cell } from "./res/ubo.js";
import { material } from "./res/material.js";
import { Material } from "./res/material.js";

export class vertex {
  constructor(P, C, N, T) {
    this.P = P;
    this.C = C;
    this.N = N;
    this.T = T;
  }
  static vert2arr(a) {
    return [
      a.P.x,
      a.P.y,
      a.P.z,
      a.C.x,
      a.C.y,
      a.C.z,
      a.N.x,
      a.N.y,
      a.N.z,
      a.T.x,
      a.T.y,
    ];
  }

  static create(a) {
    return new vertex(a.P, a.C, a.N, a.T);
  }
}

let id;
let id1;

let unifomTex;

export class prim {
  constructor(VA, VBuf, IBuf, NumOfElements, Trans, MtlNo) {
    this.VA = VA;
    this.VBuf = VBuf;
    this.IBuf = IBuf;
    this.NumOfElements = NumOfElements;
    this.Trans = Trans;
    this.MtlNo = MtlNo;
  }
  static create(Vert, NumofVert, Ind, NumofInd, MtlNo) {
    let primVertexArray = gl.createVertexArray();
    gl.bindVertexArray(primVertexArray);

    // unifomTex = gl.getUniformLocation(Material[MtlNo].ShdNo, "tex");

    let primVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, primVertexBuffer);

    let pos = [];
    for (let i = 0; i < NumofVert; i++) {
      pos = pos.concat(vertex.vert2arr(Vert[i]));
    }
    pos = new Float32Array(pos);

    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);

    let primIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, primIndexBuffer);

    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(Ind),
      gl.STATIC_DRAW
    );

    let Fsize = pos.BYTES_PER_ELEMENT;
    let posLoc = gl.getAttribLocation(Material[MtlNo].ShdNo, "in_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, Fsize * 11, 0);

    let posCol = gl.getAttribLocation(Material[MtlNo].ShdNo, "in_color");
    if (posCol != -1) {
      gl.vertexAttribPointer(posCol, 3, gl.FLOAT, false, Fsize * 11, Fsize * 3);
      gl.enableVertexAttribArray(posCol);
    }

    let posNorm = gl.getAttribLocation(Material[MtlNo].ShdNo, "in_normal");

    if (posNorm != -1) {
      gl.vertexAttribPointer(
        posNorm,
        3,
        gl.FLOAT,
        false,
        Fsize * 11,
        Fsize * 6
      );
      gl.enableVertexAttribArray(posNorm);
    }

    let posTexCoord = gl.getAttribLocation(
      Material[MtlNo].ShdNo,
      "in_texcoord"
    );

    if (posTexCoord != -1) {
      gl.vertexAttribPointer(
        posTexCoord,
        2,
        gl.FLOAT,
        false,
        Fsize * 11,
        Fsize * 9
      );
      gl.enableVertexAttribArray(posTexCoord);
    }

    return new prim(
      primVertexArray,
      primVertexBuffer,
      primIndexBuffer,
      NumofInd,
      _matr4.identity(),
      MtlNo
    );
  }

  static create_sphere(W, H, R, MtlNo){
    let Vrts = [], Ind = [];
    for (let i = 0, theta = Math.PI, k = 0; i < H; i++, theta -= Math.PI / (H - 1)) {
      for (let j = 0, phi = 0; j < W; j++, phi += (2 * Math.PI) / (W - 1)) {
        Vrts[k++] = new vertex(
          _vec3.set(
            Math.sin(theta) * Math.sin(phi) * R,
            Math.cos(theta) * R,
            Math.sin(theta) * Math.cos(phi) * R
          ),
          _vec3.set(
            Math.sin(theta) * Math.sin(phi),
            Math.cos(theta),
            Math.sin(theta) * Math.cos(phi)
          ),
          _vec3.set(
            Math.sin(theta) * Math.sin(phi),
            Math.cos(theta),
            Math.sin(theta) * Math.cos(phi)
          ),
          _vec3.set(j / (W - 1), i / (H - 1), 0)
        );
      }
    }
  
    for (let k = 0, f = 0, i = 0; i < H - 1; i++, k++) {
      for (let j = 0; j < W - 1; j++, k++) {
        Ind[f++] = k;
        Ind[f++] = k + 1;
        Ind[f++] = k + W;
  
        Ind[f++] = k + W + 1;
        Ind[f++] = k + 1;
        Ind[f++] = k + W;
      }
    }
    return prim.create(Vrts, Vrts.length, Ind, Ind.length, MtlNo);
  }

  static create_plane(W, H, MtlNo){
    let Vrts = [], Ind = [];
    
    Vrts[0] = new vertex(
      _vec3.set(-W/2, 0, H/2),
      _vec3.set(0.47, 0.3, 0.27),
      _vec3.set(0, 1, 0),
      _vec3.set(0, 0, 0)
    );
    Vrts[1] = new vertex(
      _vec3.set(W / 2, 0, -H / 2),
      _vec3.set(0.47, 0.3, 0.27),
      _vec3.set(0, 1, 0),
      _vec3.set(1, 1, 0)
    );
    Vrts[2] = new vertex(
      _vec3.set(W / 2, 0, H / 2),
      _vec3.set(0.47, 0.3, 0.27),
      _vec3.set(0, 1, 0),
      _vec3.set(0, 1, 0)
    );
    Vrts[3] = new vertex(
      _vec3.set(-W/2, 0, -H/2),
      _vec3.set(0.47, 0.3, 0.27),
      _vec3.set(0, 1, 0),
      _vec3.set(1, 0, 0)
    );
  
    Ind = [
      0, 1, 2,
  
      1, 0, 3,
    ];


    return prim.create(Vrts, Vrts.length, Ind, Ind.length, MtlNo);

  } 


  static draw(Pr, World) {
    let w = _matr4.mulmatr(Pr.Trans, World);
    let winv = _matr4.transpose(_matr4.inverse(w));
    let WVP = _matr4.mulmatr(w, cam.MatrVP);

    gl.useProgram(Material[Pr.MtlNo].ShdNo);

    gl.bindVertexArray(Pr.VA);

    UBO.update(CamUBO, Ubo_cell.MatrWVP, WVP);
    UBO.update(CamUBO, Ubo_cell.MatrW, w);
    UBO.update(CamUBO, Ubo_cell.MatrWInv, winv);
    UBO.applay(CamUBO, 0, Material[Pr.MtlNo].ShdNo);
    material.applay(Pr.MtlNo, 1);

    if (Pr.NumOfElements == 1){
      gl.drawElements(gl.POINTS, 1, gl.UNSIGNED_BYTE, 0);
    }

    if (Pr.NumOfElements == 2){
      gl.drawArrays(gl.LINES, 0, 2);
      // gl.drawElements(gl.LINES, 2, gl.UNSIGNED_BYTE, Pr.IBuf);
    }
    else if (Pr.NumOfElements > 2){
        gl.drawElements(
        gl.TRIANGLES, // TRIANGLES, TRIANGLE_STRIP
        Pr.NumOfElements, //Pr.NumOfElements
        gl.UNSIGNED_SHORT,
        Pr.IBuf
      );
    }
  }

  static create_normal(a, i) {
    a[i].N = _vec3.normalize(
      _vec3.cross(_vec3.sub(a[i + 2].P, a[i].P), _vec3.sub(a[i + 1].P, a[i].P))
    );
    a[i + 1].N = _vec3.normalize(
      _vec3.cross(
        _vec3.sub(a[i].P, a[i + 1].P),
        _vec3.sub(a[i + 2].P, a[i + 1].P)
      )
    );
    a[i + 2].N = _vec3.normalize(
      _vec3.cross(
        _vec3.sub(a[i + 1].P, a[i + 2].P),
        _vec3.sub(a[i].P, a[i + 2].P)
      )
    );

    // console.log(i + ":" + a[i].N.x + "," + a[i].N.y + "," + a[i].N.z);
  }
}


