import { CamSet, cam } from "../math/mathcam.js";
import { gl } from "./rnddata.js";
import { _vec3 } from "../math/mathvec3.js";
import { _matr4 } from "../math/mathmat4.js";
import { UBO, Ubo_Matr } from "./res/ubo.js";
import { myTimer } from "../timer.js";
import { shaderInit } from "./res/shader.js";
import { initCam, renderCam } from "../units/u_control.js";
import { initWall, renderWall } from "../units/u_wall.js";
import { initFloor, renderFloor } from "../units/u_floor.js";
import { initText, renderText } from "../units/u_text.js";
import { initParctOmniDirect, renderParctOmniDirect, FreeParctOmniDirect } from "../units/u_parct_omni_direct.js";
import { scenceNo } from "../main.js";
import { initParctDirect, renderParctDirect, FreeParctDirect } from "../units/u_parct_deir.js";
import { initParctInDisk, renderParctInDisk, FreeParctInDisk } from "../units/u_parct_disk.js";
import { initParctInTriangle, renderParctInTriangle, FreeParctInTriangle } from "../units/u_parct_triangle.js";
import { initParctInSphere, renderParctInSphere, FreeParctInSphere } from "../units/u_parct_sphere.js";
import { initTriangle, renderTriangle } from "../units/u_triangle.js";
import { initVoxel } from "./voxel.js";
import { initRandom } from "../math/mathrandom.js";
import { initPoint, renderPoint } from "../units/u_parct_points.js";
import { initLines, renderLines } from "../units/u_parct_lines.js";
import { initAttractorSphere, renderAttractorSphere } from "../units/u_attractor_sphere.js";
import { initAttractorLine, renderAttractorLine } from "../units/u_attractor_line.js";
import { initVortices, renderVortices } from "../units/u_vortices.js";
import { initVox, renderVox } from "../units/u_voxel.js";
export let CamUBO;

export function rndInit(s, n) {
  gl.clearColor(0.28, 0.47, 0.8, 1);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  initCam();
  //CamSet(_vec3.set(0, 0, 10), _vec3.set(0, 0, 0), _vec3.set(0, 1, 0));
  let World = _matr4.identity();
  let w = _matr4.mulmatr(_matr4.identity(), World);
  let winv = _matr4.transpose(_matr4.inverse(w));
  let WVP = _matr4.mulmatr(w, cam.MatrVP);

  let U = new Ubo_Matr(
    WVP,
    w,
    winv,
    cam.MatrVP,
    cam.MatrView,
    cam.Loc,
    cam.At,
    cam.Right,
    cam.Up,
    cam.Dir,
    _vec3.set(cam.ProjDist, cam.ProjFarClip, myTimer.localTime),
    _vec3.set(
      myTimer.globalTime,
      myTimer.globalDeltaTime,
      myTimer.localDeltaTime
    ),
    _vec3.set(cam.ProjSize, 1, 1)
  );

  CamUBO = UBO.add(U, "BaseData");

  shaderInit(s, n);
  initRandom();
  initVoxel();
  initFloor();
  initWall();
  initLines();
  initText();
  initParctOmniDirect();
  initParctDirect();
  initParctInDisk();
  initParctInTriangle();
  initParctInSphere();
  initVortices();
  
  //initTriangle();
  initPoint();
  initVox();

  initAttractorSphere();
  initAttractorLine();

  // initWallLR();
}

export function render() {

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

  gl.enable(gl.DEPTH_TEST)
  renderCam();



  renderFloor();
  renderWall();
  //renderTriangle();
  renderAttractorSphere();
  renderAttractorLine();
  renderVortices();
  renderVox();
  if (scenceNo == 0)
  renderParctOmniDirect();

  gl.depthMask(false)

  renderText();







  if (scenceNo == 1)
    renderPoint();

  /*if (scenceNo == 1)
    renderParctDirect();
  if (scenceNo == 2)
    renderParctInDisk();
  if (scenceNo == 3)
    renderParctInTriangle();
  if (scenceNo == 4){
    renderParctInSphere();
  }
  if (scenceNo == 5){
    FreeParctDirect();
    FreeParctOmniDirect();
    FreeParctInDisk();
    FreeParctInTriangle();
    FreeParctInSphere();
  }*/
  //renderPoint();
  gl.depthMask(true)

  gl.clearColor(0.28, 0.47, 0.8, 1);

  // renderWallLR();
}
