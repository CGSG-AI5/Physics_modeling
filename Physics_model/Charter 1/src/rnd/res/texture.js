import { gl } from "../rnddata.js";

export let Textures = [];

export class Tex {
  constructor(Name, id) {
    this.Name = Name;
    this.id = id;
  }

  static create(FileName) {
    let id = gl.createTexture();
    let n = Textures.length;
    Textures.push(new Tex(FileName, id));
    gl.bindTexture(gl.TEXTURE_2D, id);


    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([255, 255, 255, 0])
    );

    const img = new Image();
    img.src = "bin/image/" + FileName;
    img.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, Textures[n].id);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_MIN_FILTER,
        gl.LINEAR_MIPMAP_LINEAR
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };

    return n;
  }
}
