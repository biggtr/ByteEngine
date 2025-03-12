#Vertex

#version 300 es
precision mediump float;

layout(location = 0) in vec2 a_position;  
layout(location = 1) in vec2 a_texCoord;     

uniform mat3 u_Model;
uniform mat3 u_ViewProjection;
out vec2 v_texCoord;

void main() {
    vec3 pos = vec3(a_position, 1.0);
    
    vec3 transformed = u_ViewProjection * u_Model * pos;
    
    gl_Position = vec4(transformed.xy, 0.0, 1.0);
    
    v_texCoord = a_texCoord;
}

#Fragment

#version 300 es
precision highp float;
 
 
in vec2 v_texCoord;
 
uniform sampler2D u_Image;
out vec4 outColor;
 
void main() {
   outColor = texture(u_Image, v_texCoord);
}
