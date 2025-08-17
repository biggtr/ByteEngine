#Vertex
#version 300 es
precision mediump float;

layout(location = 0) in vec3 a_Position;  
layout(location = 1) in vec4 a_Color;     
layout(location = 2) in vec2 a_TexCoords;     
layout(location = 3) in float a_TexIndex;     

layout(std140) uniform Transforms
{
   mat4 u_ViewProjection;
   mat4 u_Model;
   vec4 u_Color;
};

out vec2 v_texCoord;
out vec4 v_color;
out float v_texIndex;

void main() {
    vec4 pos = vec4(a_Position, 1.0);
    gl_Position = u_ViewProjection * u_Model * pos;
    
    v_texCoord = a_TexCoords;
    v_color = a_Color;
    v_texIndex = a_TexIndex;
}

#Fragment
#version 300 es
precision highp float;

in vec2 v_texCoord;
in vec4 v_color;
in float v_texIndex;

uniform sampler2D u_Textures[16]; 
out vec4 outColor;

void main() {
   int texIndex = int(v_texIndex);
   vec4 texColor;
   
   if(texIndex == 0) texColor = texture(u_Textures[0], v_texCoord);
   else if(texIndex == 1) texColor = texture(u_Textures[1], v_texCoord);
   else if(texIndex == 2) texColor = texture(u_Textures[2], v_texCoord);
   else if(texIndex == 3) texColor = texture(u_Textures[3], v_texCoord);
   else if(texIndex == 4) texColor = texture(u_Textures[4], v_texCoord);
   else if(texIndex == 5) texColor = texture(u_Textures[5], v_texCoord);
   else if(texIndex == 6) texColor = texture(u_Textures[6], v_texCoord);
   else if(texIndex == 7) texColor = texture(u_Textures[7], v_texCoord);
   else if(texIndex == 8) texColor = texture(u_Textures[8], v_texCoord);
   else if(texIndex == 9) texColor = texture(u_Textures[9], v_texCoord);
   else if(texIndex == 10) texColor = texture(u_Textures[10], v_texCoord);
   else if(texIndex == 11) texColor = texture(u_Textures[11], v_texCoord);
   else if(texIndex == 12) texColor = texture(u_Textures[12], v_texCoord);
   else if(texIndex == 13) texColor = texture(u_Textures[13], v_texCoord);
   else if(texIndex == 14) texColor = texture(u_Textures[14], v_texCoord);
   else texColor = texture(u_Textures[15], v_texCoord);
   
   outColor = texColor * v_color;
}
