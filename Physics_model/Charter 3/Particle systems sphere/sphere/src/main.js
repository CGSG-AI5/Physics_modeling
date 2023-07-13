import { rndInit, render } from "./rnd/rndbase.js";
import { myTimer } from "./timer.js";
import { myInput } from "./input.js";
import { _vec3 } from "./math/mathvec3.js";

export let Dwind;
export let Vwind = _vec3.set1(0)
export let elastic;
export let friction;
export let scenceNo = 5;
 

let namesFile = ["../bin/shader/default/vert.glsl", "../bin/shader/default/frag.glsl", "../bin/shader/texture/vert.glsl", "../bin/shader/texture/frag.glsl",
"../bin/shader/lines/vert.glsl", "../bin/shader/lines/frag.glsl"];
let names = ["default", "texture", "lines"]
let Md = [0, 0],
  MouseClick = [0, 0],
  Wheel = 0,
  Keys = new Array(255).fill(0);

 
// export let ep = epsilon[0].value

// function fun() {      
       
// }    

document.querySelector("#swapscence").onclick = function(){
  scenceNo = (scenceNo + 1) % 6;
}


Promise.all(namesFile.map((u) => fetch(u)))
  .then((responses) => Promise.all(responses.map((res) => res.text())))
  .then((texts) => {
    rndInit(texts, names);
    const draw = () => {
      //
      Dwind = id_range.value;
      send_result.innerHTML = "d_wind: " + id_range.value;
      // wind = id_range.value;
      send_result_Vwind_x.innerHTML = "Vwind.x: " + Vwind_x.value;
      send_result_Vwind_y.innerHTML = "Vwind.y: " + Vwind_y.value;
      send_result_Vwind_z.innerHTML = "Vwind.z: " + Vwind_z.value;

      Vwind = _vec3.set(Vwind_x.value, Vwind_y.value, Vwind_z.value)

      send_result_elasticity.innerHTML = "elasticity: " +  id_elasticity.value
      elastic = id_elasticity.value;

      send_result_friction.innerHTML = "friction " +  id_friction.value
      friction = id_friction.value;
      // if (id_swapscence.onclick)
      //   console.log(1)
      window.addEventListener("mousedown", (e) => {
        if (e.button == 0) {
          MouseClick[0] = 1;
        }
        if (e.button == 2) {
          MouseClick[1] = 1;
        }
      });

      window.addEventListener("mouseup", (e) => {
        if (e.button == 0) {
          MouseClick[0] = 0;
        }
        if (e.button == 2) {
          MouseClick[1] = 0;
        }
      });

      window.addEventListener("mousemove", (e) => {
        if (e.layerY > 135){
          Md[0] = e.movementX;
          Md[1] = e.movementY;
        }
      });

      window.addEventListener("keydown", (e) => {
        Keys[e.keyCode] = 1;

      });

      window.addEventListener("keyup", (e) => {
        Keys[e.keyCode] = 0;
      });

      window.addEventListener("wheel", (e) => {
        Wheel = e.deltaY;
      });

      myTimer.response();
      myInput.response(Md, MouseClick, Wheel, Keys);
      render();
      Wheel = 0;
      Md.fill(0)
      window.requestAnimationFrame(draw);

    };
    draw();
  });
