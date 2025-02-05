#version 300 es

in vec2 a_position;
in vec2 a_textureCoords;

out vec2 v_textureCoords;

int main()
{

    v_textureCoords = a_textureCoords;
}
