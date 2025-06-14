import { Input } from "@/Input/Inputs";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { Renderer2D } from "@/Renderer/Renderer2D";
import { RendererAPIFactory } from "@/Renderer/RendererAPIFactory";
import { TestGame } from "@/TestGame/game";
import { ResourceManager } from "@/ResourceManagement/ResourceManager";
async function main() 
{
    const input = new Input();
    input.Initialize();

    
    const rendererAPI = RendererAPIFactory.Create();
    var renderer2D = new Renderer2D(rendererAPI);

    const width = document.getElementById("canvas")?.clientWidth as number
    const height = document.getElementById("canvas")?.clientHeight as number 
    const camera2D = new OrthographicCamera(0, width, 0, height, 0.0, 1.0);

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
