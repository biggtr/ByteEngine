#version 300 es
precision mediump float;

layout(location = 0) in vec2 a_position;  
layout(location = 1) in vec2 a_texCoord;     

uniform mat3 u_transformation;
uniform mat3 u_projection;     

out vec2 v_texCoord;

void main() {
    vec3 pos = vec3(a_position, 1.0);
    
    vec3 transformed = u_projection * u_transformation * pos;
    
    gl_Position = vec4(transformed.xy, 0.0, 1.0);
    
    v_texCoord = a_texCoord;
}

