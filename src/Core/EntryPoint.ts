import { WebGLContext } from "./Renderer/WebGLContext"; 
import { RendererAPI } from "./Renderer/RendererAPI";
import { Renderer2D } from "./Renderer/Renderer2D";
import { Input } from "./Input/Inputs";
import { TestGame } from "@/TestGame/game";
import { EngineComponents } from "./Application";
import { OrthographicCamera } from "./Renderer/Cameras";
import { ShaderHandler } from "./ResourceManagement/ResourceHandlers/ResourceHandler";
import { ResourceManager } from "./ResourceManagement/ResourceManager";


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
    
    const camera2D = new OrthographicCamera(0, webgl.canvas.width, 0, webgl.canvas.height); // will add it to the scene in future
    
    //resouceManager
    const shaderHandler = new ShaderHandler(webgl)
    const resourceManager = new ResourceManager();

    let app = new TestGame();
    app.Init({ renderer2D: renderer2D, inputSystem: input, camera: camera2D});
    app.Run();
    
    
}
main()
