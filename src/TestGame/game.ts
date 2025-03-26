import { Application, EngineComponents } from "@/Core/Application";
import { Renderer2D } from "@/Core/Renderer/Renderer2D";
import { Texture } from "@/Core/Renderer/Texture";
import { Vector4 } from "@/Core/Math/Vectors";
import { WebGLContext } from "@/Core/Renderer/WebGLContext";
import { Vector3 } from "@/Core/Math/Vectors";
import { OrthographicCamera } from "@/Core/Renderer/Cameras";
import { Input } from "@/Core/Input/Inputs";
import { HANDLER_TYPE, ResourceManager } from "@/Core/ResourceManagement/ResourceManager";



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
        if(!engineComponents.renderer2D || !engineComponents.inputSystem || !engineComponents.camera || !engineComponents.resourceManager)
        {
            throw new Error("EngineComponents not initialized properly..");
        }
        this.m_Renderer2D = engineComponents.renderer2D;
        this.m_Input = engineComponents.inputSystem;
        this.m_Camera2D = engineComponents.camera;

        this.m_ResourceManager = engineComponents.resourceManager;

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
        let color = new Vector4(1.0,0,0,0);
        let quadColor = new Vector4(0.4,0.7,0,0);
        this.m_Renderer2D.SetClearColor(color);
        this.m_Renderer2D.Clear();
        this.m_Renderer2D.BeginScene(this.m_Camera2D as OrthographicCamera);
        this.m_Renderer2D.DrawQuad(this.position, this.size, quadColor);
        this.m_Renderer2D.DrawSprite(new Vector3(300,0,1), this.size, color, this.m_ResourceManager.GetHandler(HANDLER_TYPE.TEXTURE).Get("Lava"));
    }

    protected OnUpdate(deltaTime: number): void
    {

        var movement = new Vector3(0,0,0);
        const prevCameraPosition: Vector3 = this.m_Camera2D.GetPosition();
        const moveSpeed = 600;
        if (this.m_Input.IsKeyPressed("KeyW"))
        {
          movement.y += moveSpeed * deltaTime;
        }
        if (this.m_Input.IsKeyPressed("KeyS"))
        {
          movement.y -= moveSpeed * deltaTime; 
        }
        if (this.m_Input.IsKeyPressed("KeyA")) 
        {
          movement.x -= moveSpeed * deltaTime; 
        }
        if (this.m_Input.IsKeyPressed("KeyD")) 
        {
          movement.x += moveSpeed * deltaTime; 
        }
        const newPosition = Vector3.Add(movement, prevCameraPosition);

        this.m_Camera2D.SetPosition(newPosition);
    }
}
