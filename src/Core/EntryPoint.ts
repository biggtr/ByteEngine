import { Shader } from "./Renderer/Shader"; 
import { WebGLContext } from "./Renderer/WebGLContext"; 

async function main()
{

  console.log("entry point ..")
  const webglContext = new WebGLContext("glcanvas")
  const webgl = webglContext.GetWebGL();
  const ourShader = new Shader(webgl);
  await ourShader.Init("../../public/assets/shaders/basic_vert.glsl", "../../public/assets/shaders/basic_frag.glsl");
  var positionAttributeLocation = ourShader.GetAttributeLocation("a_position");
  var positionBuffer = webgl.createBuffer();
  webgl.bindBuffer(webgl.ARRAY_BUFFER, positionBuffer);
  var positions = [
  0, 0,
  0, 0.5,
  0.7, 0,
  ];
  webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(positions), webgl.STATIC_DRAW);
  var VAO = webgl.createVertexArray();
  webgl.bindVertexArray(VAO);
  webgl.enableVertexAttribArray(positionAttributeLocation);
  var size = 2;          // 2 components per iteration
  var type = webgl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  webgl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset)

  webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
  webgl.clearColor(0, 0, 0, 0);
  webgl.clear(webgl.COLOR_BUFFER_BIT);
    
  ourShader.Bind();
  webgl.bindVertexArray(VAO);

  var primitiveType = webgl.TRIANGLES;
  var offset = 0;
  var count = 3;
  webgl.drawArrays(primitiveType, offset, count);
}
main()
