import { Input } from "@/Input/Inputs";
import { WebGLRendererAPI } from "@/Platform/WebGL/WebGLRendererAPI";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { Renderer2D } from "@/Renderer/Renderer2D";
import { RendererAPIFactory } from "@/Renderer/RendererAPIFactory";
import { ShaderHandler, TextureHandler } from "@/ResourceManagement/ResourceHandlers";
import { HANDLER_TYPE, ResourceManager } from "@/ResourceManagement/ResourceManager";
import { TestGame } from "@/TestGame/game";
import { context } from "./Byte";
import { BufferElement, BufferLayout, SHADER_DATA_TYPE } from "@/Renderer/Buffers";

async function main() 
{


    const input = new Input();
    input.Initialize();

    console.log("entry point ..")
    
    const webgl = context.GetContext() as WebGL2RenderingContext;
    const rendererAPI = RendererAPIFactory.Create();
    var renderer2D = new Renderer2D(rendererAPI as WebGLRendererAPI);

    const camera2D = new OrthographicCamera(0, webgl.canvas.width, 0, webgl.canvas.height);

    //resouceManager
    const shaderHandler = new ShaderHandler()
    const textureHandler = new TextureHandler();
    const resourceManager = new ResourceManager();
    resourceManager.RegisterHandler(HANDLER_TYPE.SHADER, shaderHandler);
    resourceManager.RegisterHandler(HANDLER_TYPE.TEXTURE, textureHandler);


    let app = new TestGame();
    await app.Init({ Renderer2D: renderer2D,
                   InputSystem: input,
                   OrthoCamera: camera2D,
                   ResourceManager: resourceManager,
                   });
    app.Run();


}
main()
