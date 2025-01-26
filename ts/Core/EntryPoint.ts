const canvas = document.getElementById("glcanvas") as HTMLCanvasElement
const gl = canvas.getContext("webgl") as WebGLRenderingContext
if(!gl)
{
    console.error("Failed To Get Webgl Context!!");
}

const vsSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`;

// Fragment Shader
const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
  }
`;

