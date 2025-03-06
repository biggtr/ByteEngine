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
import { OrthographicCamera } from "./Renderer/Cameras";
import { Event, KeyPressedEvent } from "./Events/Events";
import { CreateApplication } from "./Application";
import { Input } from "./Input/Inputs";


function handleInput(event: KeyPressedEvent): void
{
    console.log(event)
}
async function main()
{
    const input = new Input();
    const keyPressedEvent = input.GetKeyboadEvent();
    keyPressedEvent.Subscribe(handleInput);
    console.log("entry point ..")
    var isRunning = true;
    const webglContext = new WebGLContext("glcanvas");
    const webgl = webglContext.GetWebGL();
    console.log(webgl.canvas.width, webgl.canvas.height);

    const rendererAPI = new RendererAPI(webgl);
    var renderer2D = new Renderer2D(rendererAPI);
    await renderer2D.Init();

    var lavaTexture = new Texture(webgl);
    await lavaTexture.Create("/assets/textures/lavaTexture.jpg")

    let color = new Vector4(1.0,0,0,0);
    let quadColor = new Vector4(0.4,0.7,0,0);
    webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
    var angle = 0;
    const moveSpeed = 4;
    var position = new Vector3(0, 200, 1);
    var size = new Vector3(200, 200, 1);
    const camera = new OrthographicCamera(
        0,  // left
        webgl.canvas.width,   // right
        0, // bottom
        webgl.canvas.height   // top
    );
    input.Initialize();

    async function GameLoop() 
    {
        //render
        renderer2D.SetClearColor(color);
        renderer2D.Clear();
        renderer2D.BeginScene(camera);
        renderer2D.DrawQuad(position, size, quadColor);
        renderer2D.DrawSprite(new Vector3(200,0,1), size, quadColor, lavaTexture);

        //input
        var movement = new Vector3(0,0,0);
        const prevCameraPosition = camera.GetPosition();

        if (input.IsKeyPressed("KeyW"))
        {
          movement.y += moveSpeed; 
        }
        if (input.IsKeyPressed("KeyS"))
        {
          movement.y -= moveSpeed; 
        }
        if (input.IsKeyPressed("KeyA")) 
        {
          movement.x -= moveSpeed; 
        }
        if (input.IsKeyPressed("KeyD")) 
        {
          movement.x += moveSpeed; 
        }
        const newPosition = Vector3.Add(movement, prevCameraPosition);
        // Update the camera position
        camera.SetPosition(newPosition);;
        // Request next frame
        requestAnimationFrame(GameLoop);
    }
    GameLoop();
}
main()
