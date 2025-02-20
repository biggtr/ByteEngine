import { Shader } from "./Renderer/Shader"; 
import { WebGLContext } from "./Renderer/WebGLContext"; 
import { VertexBuffer, BufferLayout, BufferElement, IndexBuffer }  from "./Renderer/Buffers"
import { Texture } from "./Renderer/Texture";
import { VertexArray } from "./Renderer/VertexArray";
import { RendererAPI } from "./Renderer/RendererAPI";
import { Vector3, Vector4 } from "./Math/Vectors";
import { Matrix3 } from "./Math/Matrices";
async function main()
{
    const keysPressed: { [key: string]: boolean } = {};

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      keysPressed[event.code] = true;
    });

    document.addEventListener("keyup", (event: KeyboardEvent) => {
      keysPressed[event.code] = false;
    });
    console.log("entry point ..")
    var isRunning = true;
    const webglContext = new WebGLContext("glcanvas")
    const webgl = webglContext.GetWebGL();
    const ourShader = new Shader(webgl);
    await ourShader.Init("/assets/shaders/texture.vert", "/assets/shaders/texture.frag");
    console.log(webgl.canvas.width, webgl.canvas.height);

   var squareVertices = new Float32Array([
        -40,   40,   0.0, 1.0, 
        -40,  -40,   0.0, 0.0, 
         40,  -40,   1.0, 0.0, 
         40,   40,   1.0, 1.0, 
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
    var sx = 1, sy = 1;
    var tx = 1, ty = 1;
    var angle = 0;
    const moveSpeed = 10;
    function GameLoop() 
    {
        //input 

        if (keysPressed["KeyW"]) { ty += moveSpeed; }  // Move up
        if (keysPressed["KeyS"]) { ty -= moveSpeed; }  // Move down
        if (keysPressed["KeyA"]) { tx -= moveSpeed; }  // Move left
        if (keysPressed["KeyD"]) { tx += moveSpeed; }  // Move right

        //render
        var scaleMatrix = Matrix3.Scale(sx, sy);
        var rotationMatrix = scaleMatrix.Multiply(Matrix3.Rotate(angle));
        var transformationMatrix = rotationMatrix.Multiply(Matrix3.Translate(tx, ty));
        ourShader.Bind();
        webgl.uniformMatrix3fv(ourShader.GetUniformLocation("u_transformation"), false, transformationMatrix.GetAll());
        webgl.uniform1i(imageLocation, 0);
        var projectionMatrix = Matrix3.Ortho(0, webgl.canvas.width, 0, webgl.canvas.height);
        webgl.uniformMatrix3fv(ourShader.GetUniformLocation("u_projection"), false,projectionMatrix.GetAll());
        RendererAPI.ClearColor(color);
        RendererAPI.Clear();
        RendererAPI.DrawIndexed(ourShader, VAO);

            // Request next frame
        requestAnimationFrame(GameLoop);
    }
    GameLoop();
}
main()
