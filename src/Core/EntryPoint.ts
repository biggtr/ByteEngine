import { Input } from "@/Input/Inputs";
import { WebGLRendererAPI } from "@/Platform/WebGL/WebGLRendererAPI";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { GraphicsContextFactory } from "@/Renderer/GraphicsContextFactory";
import { Renderer2D } from "@/Renderer/Renderer2D";
import { RendererAPIFactory } from "@/Renderer/RendererAPIFactory";
import { ShaderHandler, TextureHandler } from "@/ResourceManagement/ResourceHandlers";
import { HANDLER_TYPE, ResourceManager } from "@/ResourceManagement/ResourceManager";
import { TestGame } from "@/TestGame/game";

async function main() 
{


    const input = new Input();
    input.Initialize();




    console.log("entry point ..")
    const webglContext = GraphicsContextFactory.Create("glcanvas");
    webglContext.Init();
    const webgl: WebGL2RenderingContext = webglContext.GetContext() as WebGL2RenderingContext;

    console.log(`Webglwidth : ${webgl.canvas}`)
    const rendererAPI = RendererAPIFactory.Create(webglContext);
    var renderer2D = new Renderer2D(rendererAPI as WebGLRendererAPI);

    const camera2D = new OrthographicCamera(0, webgl.canvas.width, 0, webgl.canvas.height);

    //resouceManager
    const shaderHandler = new ShaderHandler(webglContext)
    const textureHandler = new TextureHandler(webglContext);
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
