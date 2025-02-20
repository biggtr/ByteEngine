#version 300 es
precision highp float;
 
// our texture
uniform sampler2D u_image;
 
// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;
 
// we need to declare an output for the fragment shader
out vec4 outColor;
 
void main() {
   outColor = vec4(1.0,0.0,0.0,1.0) * texture(u_image, v_texCoord);
}
