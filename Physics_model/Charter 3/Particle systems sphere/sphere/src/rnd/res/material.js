import { UBO } from "./ubo.js";
import { _vec3 } from "../../math/mathvec3.js";
import { shad } from "./shader.js";
import { Textures } from "./texture.js";
import { gl } from "../rnddata.js";

export let Material = [];

export class material {
  constructor(Name, Ka, Kd, Ks, Ph, Trans, Tex, UboNo, ShdNo) {
    this.Name = Name; /* Material name */

    /* Illumination coefficients */

    this.Ka = Ka;
    this.Kd = Kd;
    this.Ks = Ks;
    this.Trans = Trans;
    this.Ph = Ph;
    this.Tex = Tex;
    this.UboNo = UboNo;
    this.ShdNo = ShdNo;
  }

  static MtlGetDef() {
    return new material(
      "Default",
      _vec3.set(0.1, 0.1, 0.1),
      _vec3.set(0.9, 0.9, 0.9),
      _vec3.set(0.3, 0.3, 0.3),
      30,
      1,
      [-1, -1, -1, -1, -1, -1, -1, -1],
      shad[0].Id
    );
  }
  static set(Name, Ka, Kd, Ks, Ph, Trans, Tex, UboNo, ShaderName) {
    let sh = 0;
    for (let i = 0; i < shad.length; i++) {
      if (shad[i].Name == ShaderName) {
        sh = i;
      }
    }
    return new material(Name, Ka, Kd, Ks, Ph, Trans, Tex, UboNo, shad[sh].Id);
  }
  static add(Mtl) {
    Mtl.UboNo = UBO.add(Mtl, "Material");
    Material.push(Mtl);
    return Material.length - 1;
  }
  static applay(MtlNo, point) {
    let unifomTex;
    for (let i = 0; i < 8; i++) {
      if (Material[MtlNo].Tex[i] != -1) {
        unifomTex = gl.getUniformLocation(Material[MtlNo].ShdNo, "tex" + i);
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, Textures[Material[MtlNo].Tex[i]].id);
        gl.uniform1i(unifomTex, i);
      }
    }
    UBO.applay(Material[MtlNo].UboNo, point, Material[MtlNo].ShdNo);
  }
}

export let Matlib = {
  Black_Plastic: [
    "Black_Plastic",
    _vec3.set(0.0, 0.0, 0.0),
    _vec3.set(0.01, 0.01, 0.01),
    _vec3.set(0.5, 0.5, 0.5),
    32,
    1,
  ],
  Brass: new material(
    "Brass",
    _vec3.set(0.329412, 0.223529, 0.027451),
    _vec3.set(0.780392, 0.568627, 0.113725),
    _vec3.set(0.992157, 0.941176, 0.807843),
    27.8974,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Bronze: new material(
    "Bronze",
    _vec3.set(0.2125, 0.1275, 0.054),
    _vec3.set(0.714, 0.4284, 0.18144),
    _vec3.set(0.393548, 0.271906, 0.166721),
    25.6,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Chrome: new material(
    "Chrome",
    _vec3.set(0.25, 0.25, 0.25),
    _vec3.set(0.4, 0.4, 0.4),
    _vec3.set(0.774597, 0.774597, 0.774597),
    76.8,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Copper: new material(
    "Copper",
    _vec3.set(0.19125, 0.0735, 0.0225),
    _vec3.set(0.7038, 0.27048, 0.0828),
    _vec3.set(0.256777, 0.137622, 0.086014),
    12.8,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Gold: [
    "Gold",
    _vec3.set(0.24725, 0.1995, 0.0745),
    _vec3.set(0.75164, 0.60648, 0.22648),
    _vec3.set(0.628281, 0.555802, 0.366065),
    51.2,
    1,
  ],
  Peweter: new material(
    "Peweter",
    _vec3.set(0.10588, 0.058824, 0.113725),
    _vec3.set(0.427451, 0.470588, 0.541176),
    _vec3.set(0.3333, 0.3333, 0.521569),
    9.84615,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Silver: new material(
    "Silver",
    _vec3.set(0.19225, 0.19225, 0.19225),
    _vec3.set(0.50754, 0.50754, 0.50754),
    _vec3.set(0.508273, 0.508273, 0.508273),
    51.2,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Polished_Silver: new material(
    "Polished_Silver",
    _vec3.set(0.23125, 0.23125, 0.23125),
    _vec3.set(0.2775, 0.2775, 0.2775),
    _vec3.set(0.773911, 0.773911, 0.773911),
    89.6,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Turquoise: [
    "Turquoise",
    _vec3.set(0.1, 0.18725, 0.1745),
    _vec3.set(0.396, 0.74151, 0.69102),
    _vec3.set(0.297254, 0.30829, 0.306678),
    12.8,
    1,
  ],
  Ruby: [
    "Ruby",
    _vec3.set(0.1745, 0.01175, 0.01175),
    _vec3.set(0.61424, 0.04136, 0.04136),
    _vec3.set(0.727811, 0.626959, 0.626959),
    76.8,
    1,
  ],
  Polished_Gold: new material(
    "Polished_Gold",
    _vec3.set(0.24725, 0.2245, 0.0645),
    _vec3.set(0.34615, 0.3143, 0.0903),
    _vec3.set(0.797357, 0.723991, 0.208006),
    83.2,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Polished_Bronze: new material(
    "Polished_Bronze",
    _vec3.set(0.25, 0.148, 0.06475),
    _vec3.set(0.4, 0.2368, 0.1036),
    _vec3.set(0.774597, 0.458561, 0.200621),
    76.8,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Polished_Copper: new material(
    "Polished_Copper",
    _vec3.set(0.2295, 0.08825, 0.0275),
    _vec3.set(0.5508, 0.2118, 0.066),
    _vec3.set(0.580594, 0.223257, 0.0695701),
    51.2,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Jade: new material(
    "Jade",
    _vec3.set(0.135, 0.2225, 0.1575),
    _vec3.set(0.135, 0.2225, 0.1575),
    _vec3.set(0.316228, 0.316228, 0.316228),
    12.8,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Obsidian: [
    "Obsidian",
    _vec3.set(0.05375, 0.05, 0.06625),
    _vec3.set(0.18275, 0.17, 0.22525),
    _vec3.set(0.332741, 0.328634, 0.346435),
    38.4,
    1,
  ],
  Pearl: new material(
    "Pearl",
    _vec3.set(0.25, 0.20725, 0.20725),
    _vec3.set(1.0, 0.829, 0.829),
    _vec3.set(0.296648, 0.296648, 0.296648),
    11.264,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
  Emerald: [
    "Emerald",
    _vec3.set(0.0215, 0.1745, 0.0215),
    _vec3.set(0.07568, 0.61424, 0.07568),
    _vec3.set(0.633, 0.727811, 0.633),
    76.8,
    1,
  ],
  Black_Rubber: new material(
    "Black_Rubber",
    _vec3.set(0.02, 0.02, 0.02),
    _vec3.set(0.01, 0.01, 0.01),
    _vec3.set(0.4, 0.4, 0.4),
    10.0,
    1,
    [-1, -1, -1, -1, -1, -1, -1, -1]
  ),
};
