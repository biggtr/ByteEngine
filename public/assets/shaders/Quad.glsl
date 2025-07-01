#Vertex
#version 300 es
precision mediump float;

layout(location = 0) in vec2 a_position;  
layout(location = 1) in vec2 a_texCoord;     

layout(std140) uniform Transforms
{
   mat4 u_ViewProjection;
   mat4 u_Model;
   vec4 u_Color;
};


out vec2 v_texCoord;
out vec4 v_color;
void main() {
   vec4 pos = vec4(a_position, 0.0, 1.0);

   vec4 transformed = u_ViewProjection * u_Model * pos;

   gl_Position = transformed;
   v_color = u_Color;
   v_texCoord = a_texCoord;
}

#Fragment
#version 300 es
precision highp float;
 
 
in vec2 v_texCoord;
in vec4 v_color;
out vec4 outColor;
 
void main() {
   outColor = v_color;
}
