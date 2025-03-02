#version 300 es
precision highp float;
 
 
in vec2 v_texCoord;
 
uniform sampler2D u_Image;
out vec4 outColor;
 
void main() {
   outColor = texture(u_Image, v_texCoord);
}
