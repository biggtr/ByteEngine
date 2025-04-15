import { Application, EngineComponents } from "@/Core/Application";
import { Input } from "@/Input/Inputs";
import { Vector3, Vector4 } from "@/Math/Vectors";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { Renderer2D } from "@/Renderer/Renderer2D";
import { HANDLER_TYPE, ResourceManager } from "@/ResourceManagement/ResourceManager";



//Ugly Class Will remove it in future just for testing 
export class TestGame extends Application
{
    private m_Renderer2D!: Renderer2D;
    private m_Input!: Input;
    private m_Camera2D!: OrthographicCamera;
    private m_ResourceManager!: ResourceManager;
    private position: Vector3 = new Vector3(0,200,1);
    private size = new Vector3(200, 200, 1);

    protected async OnInit(engineComponents: EngineComponents): Promise<void>
    {
        if(!engineComponents.Renderer2D || !engineComponents.InputSystem || !engineComponents.OrthoCamera || !engineComponents.ResourceManager)
        {
            throw new Error("EngineComponents not initialized properly..");
        }
        this.m_Renderer2D = engineComponents.Renderer2D;
        this.m_Input = engineComponents.InputSystem;
        this.m_Camera2D = engineComponents.OrthoCamera;

        this.m_ResourceManager = engineComponents.ResourceManager;

        const textureManager = this.m_ResourceManager.GetHandler(HANDLER_TYPE.TEXTURE);
        await textureManager.Load("Lava", "/assets/textures/lavaTexture.jpg");

        const shaderManager = this.m_ResourceManager.GetHandler(HANDLER_TYPE.SHADER);
        await shaderManager.Load("Quad", "/assets/shaders/QuadShader.glsl");
        await shaderManager.Load("Sprite", "/assets/shaders/SpriteShader.glsl");
        await this.m_Renderer2D.Init(
            {
                quadShader: shaderManager.Get("Quad"),
                spriteShader: shaderManager.Get("Sprite")
            }
        )
    }

    protected OnRender(): void
    {
    }

    protected OnUpdate(deltaTime: number): void
    {

    }
}
