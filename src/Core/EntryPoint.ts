import { Input } from "@/Input/Inputs";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { Renderer2D } from "@/Renderer/Renderer2D";
import { RendererAPIFactory } from "@/Renderer/RendererAPIFactory";
import { TestGame } from "@/TestGame/game";
import { ResourceManager } from "@/ResourceManagement/ResourceManager";
import { context } from "./Byte";
async function main() 
{
    const input = new Input();
    input.Initialize();

    
    const rendererAPI = RendererAPIFactory.Create();
    var renderer2D = new Renderer2D(rendererAPI);

    const width = context.GetWidth()
    const height = context.GetHeight()
    
    console.log(`Width : ${width}, height: ${height}`)
    const camera2D = new OrthographicCamera(
        -width / 2, 
        width / 2,
        -height / 2,
        height / 2,
        0.1,  
        100
    );
    const resourceManager = new ResourceManager();
    resourceManager.Init();


    let app = new TestGame();
    await app.Init({ Renderer2D: renderer2D,
                   InputSystem: input,
                   OrthoCamera: camera2D,
                   ResourceManager: resourceManager,
                   });
    app.Run();


}
main()
