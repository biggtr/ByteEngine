import { Shader } from "./Renderer/Shader"; 
import { WebGLContext } from "./Renderer/WebGLContext"; 
import { VertexBuffer }  from "./Renderer/Buffers"

async function main()
{

  console.log("entry point ..")
  const webglContext = new WebGLContext("glcanvas")
  const webgl = webglContext.GetWebGL();
  const ourShader = new Shader(webgl);
  await ourShader.Init("../../public/assets/shaders/basic_vert.glsl", "../../public/assets/shaders/basic_frag.glsl");

 
  var vertices = new Float32Array([
    0.0,  0.5,   // Vertex 1 (x, y)
   -0.5, -0.5,   // Vertex 2 (x, y)
    0.5, -0.5    // Vertex 3 (x, y)
  ]);

  const vertexBuffer = new VertexBuffer(webgl);
  vertexBuffer.CreateBuffer(vertices)
  var positionAttributeLocation = ourShader.GetAttributeLocation("a_position");
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
