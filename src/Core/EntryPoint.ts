import { Shader } from "./Renderer/Shader"; 
import { WebGLContext } from "./Renderer/WebGLContext"; 
import { VertexBuffer, BufferLayout, BufferElement, IndexBuffer }  from "./Renderer/Buffers"
import { Texture } from "./Renderer/Texture";
import { VertexArray } from "./Renderer/VertexArray";
import { RendererAPI } from "./Renderer/RendererAPI";
import { Vector4 } from "./Math/Vectors";
async function main()
{

    console.log("entry point ..")
    const webglContext = new WebGLContext("glcanvas")
    const webgl = webglContext.GetWebGL();
    const ourShader = new Shader(webgl);
    await ourShader.Init("/assets/shaders/texture.vert", "/assets/shaders/texture.frag");


   var squareVertices = new Float32Array([
        -0.5,  0.5, 0.0,  1.0,  
        -0.5, -0.5, 0.0,  0.0,  
         0.5, -0.5, 1.0,  0.0,  
         0.5,  0.5, 1.0,  1.0,  
    ]);

    var squareIndices = new Uint32Array([
        0, 1, 2,  
        0, 2, 3  
    ]); 


    const squareVBO = new VertexBuffer(webgl);
    squareVBO.CreateBuffer(squareVertices)
    const squareEBO = new IndexBuffer(webgl);
    squareEBO.Create(squareIndices, squareIndices.length);
    const positionElement = new BufferElement(webgl.FLOAT, "position", 2);
    const texCoordsElement = new BufferElement(webgl.FLOAT, "texture",2);
    var bufferLayout = new BufferLayout([positionElement, texCoordsElement]);
    squareVBO.SetLayout(bufferLayout);

    var VAO = new VertexArray(webgl);
    VAO.AddVertexBuffer(squareVBO);
    VAO.SetIndexBuffer(squareEBO);
    VAO.Bind();

    var imageLocation = ourShader.GetUniformLocation("u_image");
    
    var texture = new Texture(webgl);
    await texture.CreateTexture("/assets/textures/lavaTexture.jpg")
    texture.Bind(0);

    RendererAPI.Init(webgl);
    let color = new Vector4(0,0,0,0);
    webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
    RendererAPI.ClearColor(color);
    RendererAPI.Clear();

    webgl.uniform1i(imageLocation, 0);
    RendererAPI.DrawIndexed(ourShader, VAO);


}
main()
