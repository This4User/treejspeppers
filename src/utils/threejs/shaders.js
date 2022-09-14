export const vertexShader = () => {
	return `
    varying vec3 v_vertex; 

    void main() {
      v_vertex = position; 

      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition; 
    }
  `;
};

export const fragmentShader = () => {
	return `
      uniform vec3 colorA; 
      uniform vec3 colorB; 
      uniform float time;
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      varying vec3 v_vertex;

      void main() {
      	vec3 color = vec3(0.0);
      	float pct = abs(cos(sin(time + v_vertex.x)));
      	
      	color = mix(colorA, colorB, pct);
      	
        gl_FragColor = vec4(color, 1.0);
        
        #ifdef USE_FOG
          #ifdef USE_LOGDEPTHBUF_EXT
              float depth = gl_FragDepthEXT / gl_FragCoord.w;
          #else
              float depth = gl_FragCoord.z / gl_FragCoord.w;
          #endif
          float fogFactor = smoothstep( fogNear, fogFar, depth );
          gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
      #endif
      }
  `;
};