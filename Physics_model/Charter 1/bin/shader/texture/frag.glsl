#version 300 es


    out highp vec4 o_color;
    in highp vec3 DrawColor;
    in highp vec3 DrawPos;
    in highp vec3 DrawNormal;
    in highp vec2 DrawTexCoord;


    precision highp float;

    uniform sampler2D tex0;
    uniform sampler2D tex1;

    uniform BaseData
    {
        mat4 WVP;
        mat4 MatrW;
        mat4 MatrWInv;
        mat4 MatrVP;
        mat4 MatrV;
        vec4 CamLoc;
        vec4 CamAt;
        vec4 CamRight;
        vec4 CamUp;
        vec4 CamDir;
        vec4 ProjDistFarTimeLocal;
        vec4 TimeGlobalDeltaGlobalDeltaLocal;
        vec4 ProjectSize;
    }; 

    uniform Material
    {
        vec4 Ka;
        vec4 Kd;
        vec4 Ks;
        vec4 PhTrans;
        vec4 Tex0123;
        vec4 Tex4567;
    }; 

    vec3 shade (vec3 P, vec3 N)
    {
      vec3 L = normalize(vec3(2.0, 2.0, 3.0));
      vec3 LC = vec3(1.0, 1.0, 1.0);
      vec3 V = normalize(P - CamLoc.xyz);

      vec3 color = Ka.xyz;


      N = faceforward(N, V, N);

      color += max(0.0, dot(N, L)) * Kd.xyz * LC;

      vec3 R = reflect(V, N);
      color += pow(max(0.0, dot (R, L)), PhTrans.x) * Ks.xyz * LC;
    
      return color;
    }
      void main() {
        vec4 tc1 = texture(tex0, DrawTexCoord);
          if (Tex0123.x != 0.0){
            if (tc1.a > 0.2)
              o_color = tc1;
            else
              discard;
          }
          else{
            o_color =  vec4(shade(DrawPos, normalize(DrawNormal)), 1.0);
          } 

      // o_color = tc;   
    }
