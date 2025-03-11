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
import { Input } from "./Input/Inputs";
import { TestGame } from "@/TestGame/game";
import { EngineComponents } from "./Application";


function handleInput(event: KeyPressedEvent): void
{
    console.log(event)
}

async function main()
{

 
    const input = new Input();
    input.Initialize();
    console.log("entry point ..")
    const webglContext = new WebGLContext("glcanvas");
    const webgl = webglContext.GetWebGL();
    console.log(webgl.canvas.width, webgl.canvas.height);

    const rendererAPI = new RendererAPI(webgl);
    var renderer2D = new Renderer2D(rendererAPI);
    await renderer2D.Init();
    
    let app = new TestGame();
    app.Init({webGL : webglContext, renderer2D: renderer2D, inputSystem: input});
    app.Run();
    
    
}
main()
