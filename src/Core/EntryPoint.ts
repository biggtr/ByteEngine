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


const keysPressed: {[key: string]: boolean} = {};
function handleInput(event: KeyPressedEvent): void
{
    keysPressed[event.m_KeyCode] = event.m_Pressed;
}
async function main()
{
    const input = new Input();
    const keyPressedEvent = input.GetKeyboadEvent();
    keyPressedEvent.Subscribe(handleInput);
    console.log("entry point ..")
    var isRunning = true;
    const webglContext = new WebGLContext("glcanvas")
    const webgl = webglContext.GetWebGL();
    console.log(webgl.canvas.width, webgl.canvas.height);

    const rendererAPI = new RendererAPI(webgl);
    var renderer2D = new Renderer2D(rendererAPI);
    await renderer2D.Init();


   
    let color = new Vector4(1.0,0,0,0);
    let quadColor = new Vector4(0.4,0.7,0,0);
    webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
    var angle = 0;
    const moveSpeed = 4;
    var position = new Vector3(0, 200, 1);
    var size = new Vector3(200, 200, 1);
    const camera = new OrthographicCamera(
        0,  // left
        webgl.canvas.width/2,   // right
        0, // bottom
        webgl.canvas.height/2   // top
    );

    function GameLoop() 
    {
        //render
        renderer2D.SetClearColor(color);
        renderer2D.Clear();
        renderer2D.BeginScene(camera);
        renderer2D.DrawQuad(position, size, quadColor);

        //input
        input.IsKeyPressed();
        var prevCameraPosition = camera.GetPosition();
        if (keysPressed["KeyW"]) { 
            camera.SetPosition(new Vector3(prevCameraPosition.x, prevCameraPosition.y + moveSpeed, prevCameraPosition.z));
        }

        if (keysPressed["KeyS"]) { camera.SetPosition(new Vector3(prevCameraPosition.x, prevCameraPosition.y - moveSpeed, prevCameraPosition.z)); }  // Move down
        if (keysPressed["KeyA"]) { camera.SetPosition(new Vector3(prevCameraPosition.x - moveSpeed, prevCameraPosition.y, prevCameraPosition.z));  }  // Move left
        if (keysPressed["KeyD"]) { camera.SetPosition(new Vector3(prevCameraPosition.x + moveSpeed, prevCameraPosition.y, prevCameraPosition.z));  }  // Move right
        // Request next frame
        requestAnimationFrame(GameLoop);
    }
    GameLoop();
}
main()
