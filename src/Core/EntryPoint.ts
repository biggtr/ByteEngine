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





    var imageLocation = ourShader.GetUniformLocation("u_image");
    
    var texture = new Texture(webgl);
    await texture.CreateTexture("/assets/textures/lavaTexture.jpg")
    texture.Bind(0);

    let color = new Vector4(0,0,0,0);
    webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
    var sx = 1, sy = 1;
    var tx = 1, ty = 1;
    var angle = 0;
    const moveSpeed = 30;
    function GameLoop() 
    {
        //input 

        if (keysPressed["KeyW"]) { ty += moveSpeed; }  // Move up
        if (keysPressed["KeyS"]) { ty -= moveSpeed; }  // Move down
        if (keysPressed["KeyA"]) { tx -= moveSpeed; }  // Move left
        if (keysPressed["KeyD"]) { tx += moveSpeed; }  // Move right

        //render
                   // Request next frame
        requestAnimationFrame(GameLoop);
    }
    GameLoop();
}
main()
