#Vertex
#version 300 es
precision mediump float;

layout(location = 0) in vec3 a_Position;  
layout(location = 1) in vec4 a_Color;     

layout(std140) uniform Transforms
{
   mat4 u_ViewProjection;
   mat4 u_Model;
   vec4 u_Color;
};

out vec4 v_color;

void main() {
   vec4 pos = vec4(a_Position, 1.0);
   gl_Position = u_ViewProjection * u_Model * pos;
   v_color = a_Color; 
}

#Fragment
#version 300 es
precision highp float;

in vec4 v_color;
out vec4 outColor;

void main() {
   outColor = v_color;
}
