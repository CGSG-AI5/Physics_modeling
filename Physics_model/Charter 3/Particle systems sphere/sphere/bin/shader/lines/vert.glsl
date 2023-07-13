#version 300 es
      in highp vec3 in_pos;
      in highp vec3 in_color;
      in highp vec3 in_normal;

      precision highp float;

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

      out vec3 DrawColor;
      out vec3 DrawPos;
      out vec3 DrawNormal;
      out float R;

      void main()
      {
        gl_Position = WVP * vec4(in_pos, 1);



        DrawColor = vec3(in_color.x, in_color.yz);
        DrawPos = (MatrW * vec4(in_pos, 1)).xyz;
        float l = distance(CamLoc.xyz, DrawPos);
        DrawNormal = mat3(MatrWInv) * in_normal;
        R = (l - 60.0) / 20.0;
        //gl_PointSize = max(0.0, 20.0 - 20.0 * ((l - 60.0) / 20.0));
        //gl_PointSize = 100.0 - l;
      }