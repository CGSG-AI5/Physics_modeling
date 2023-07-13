import { gl } from "../rnddata.js";

export let shad = []

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("!!!!!!");
  }

  return shader;
}

class Shader{
  constructor(Name, Id){
    this.Name = Name;
    this.Id = Id;
  }
}


export function shaderInit(s, n) {
  for (let i = 0; i < s.length / 2; i++){
    const vertexSh = loadShader(gl, gl.VERTEX_SHADER, s[i * 2 ]);
    const fragmentSh = loadShader(gl, gl.FRAGMENT_SHADER, s[i * 2 + 1]);

    let program = gl.createProgram();
    gl.attachShader(program, vertexSh);
    gl.attachShader(program, fragmentSh);
    gl.linkProgram(program);


    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      alert(gl.getProgramInfoLog(program));
    }
    shad.push(new Shader(n[i], program))
  }
}
