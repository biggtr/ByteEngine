import { Shader } from "./Renderer/Shader"; 
import { WebGLContext } from "./Renderer/WebGLContext"; 
import { VertexBuffer, BufferLayout }  from "./Renderer/Buffers"
import { Texture } from "./Renderer/Texture";
import { VertexArray } from "./Renderer/VertexArray";
async function main()
{

    console.log("entry point ..")
    const webglContext = new WebGLContext("glcanvas")
    const webgl = webglContext.GetWebGL();
    const ourShader = new Shader(webgl);
    await ourShader.Init("/assets/shaders/texture.vert", "/assets/shaders/texture.frag");


    var positions = new Float32Array([
        -0.5,  0.5, 0.0,  1.0,  
        -0.5, -0.5,0.0,  0.0,  
        0.5, -0.5, 1.0,  0.0,  
        -0.5,  0.5, 0.0,  1.0,  
        0.5, -0.5, 1.0,  0.0,  
         0.5,  0.5, 1.0,  1.0, 
    ]);


    const PositionBuffer = new VertexBuffer(webgl);
    PositionBuffer.CreateBuffer(positions)

    var bufferLayout = new BufferLayout();

    bufferLayout.PushFloat(2); //position
    bufferLayout.PushFloat(2); //texCoords
    var VAO = new VertexArray(webgl);
    VAO.AddBufferLayout(bufferLayout);
    VAO.Bind();
    

    var imageLocation = ourShader.GetUniformLocation("u_image");
    
    var texture = new Texture(webgl);
    await texture.CreateTexture("/assets/textures/basic.png")
    texture.Bind(0);

    webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
    webgl.clearColor(0, 0, 0, 0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    ourShader.Bind();
    webgl.uniform1i(imageLocation, 0);

    var primitiveType = webgl.TRIANGLES;
    var offset = 0;
    var count = 6;
    webgl.drawArrays(primitiveType, offset, count);

}
main()
