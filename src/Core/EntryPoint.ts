import { Shader } from "./Renderer/Shader"; 
import { WebGLContext } from "./Renderer/WebGLContext"; 
import { VertexBuffer, BufferLayout, BufferElement, IndexBuffer }  from "./Renderer/Buffers"
import { Texture } from "./Renderer/Texture";
import { VertexArray } from "./Renderer/VertexArray";
import { RendererAPI } from "./Renderer/RendererAPI";
import { Vector3, Vector4 } from "./Math/Vectors";
import { Matrix3 } from "./Math/Matrices";
import { Renderer2D } from "./Renderer/Renderer2D";
import { RenderCommand } from "./Renderer/RenderCommand";
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
    console.log(webgl.canvas.width, webgl.canvas.height);

    const rendererAPI = new RendererAPI(webgl);
    const renderCommand = new RenderCommand(rendererAPI);
    var renderer2D = new Renderer2D(renderCommand);
    await renderer2D.Init();


   
    let color = new Vector4(1.0,0,0,0);
    let quadColor = new Vector4(0.4,0.7,0,0);
    webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
    var sx = 1, sy = 1;
    var tx = 1, ty = 1;
    var angle = 0;
    const moveSpeed = 0.1;
    renderCommand.ClearColor(color);
    var position = new Vector3(tx, ty, 1);
    var size = new Vector3(sx, sy, 1);

    function GameLoop() 
    {
        //input 

        if (keysPressed["KeyW"]) { position.y += moveSpeed; }  // Move up
        if (keysPressed["KeyS"]) { position.y -= moveSpeed; }  // Move down
        if (keysPressed["KeyA"]) { position.x -= moveSpeed; }  // Move left
        if (keysPressed["KeyD"]) { position.x += moveSpeed; }  // Move right

        //render
        renderCommand.Clear();
        renderer2D.DrawQuad(position, size, quadColor);
                   // Request next frame
        requestAnimationFrame(GameLoop);
    }
    GameLoop();
}
main()
