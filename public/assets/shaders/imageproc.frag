#version 300 es
precision highp float;
 
uniform sampler2D u_image;
 
// the texCoords passed in from the vertex shader.
in vec2 v_textureCoords;
 
out vec4 outColor;
 
void main() {
   outColor = texture(u_image, v_texCoord);
}
