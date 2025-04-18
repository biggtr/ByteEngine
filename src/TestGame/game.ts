import { Application, EngineComponents } from "@/Core/Application";
import { Input } from "@/Input/Inputs";
import { Vector3, Vector4 } from "@/Math/Vectors";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { Renderer2D, Sprite } from "@/Renderer/Renderer2D";
import { HANDLER_TYPE, ResourceManager } from "@/ResourceManagement/ResourceManager";
import { Animation } from "@/Animation/Animation";


//Ugly Class Will remove it in future just for testing 
export class TestGame extends Application
{
    private m_Renderer2D!: Renderer2D;
    private m_Input!: Input;
    private m_Camera2D!: OrthographicCamera;
    private m_ResourceManager!: ResourceManager;
    private position: Vector3 = new Vector3(100,100,1);
    private size = new Vector3(200, 200, 1);
    private sprite!: Sprite;
    private idleAnimation!: Animation;

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
        await textureManager.Load("idle", "/assets/textures/Idle.png");

        const shaderManager = this.m_ResourceManager.GetHandler(HANDLER_TYPE.SHADER);
        await shaderManager.Load("Quad", "/assets/shaders/QuadShader.glsl");
        await shaderManager.Load("Sprite", "/assets/shaders/SpriteShader.glsl");
        await this.m_Renderer2D.Init(
            {
                quadShader: shaderManager.Get("Quad"),
                spriteShader: shaderManager.Get("Sprite")
            }
        )
        
        const IdleTexture = this.m_ResourceManager.GetHandler(HANDLER_TYPE.TEXTURE).Get("idle");
        this.sprite= new Sprite(IdleTexture);
        this.sprite.Size = new Vector3(320,32,1);
        console.log(this.sprite.UVs)
        this.idleAnimation = new Animation("Idle",10,0.06,32,32,this.sprite)
    }

    protected OnRender(): void
    {
        this.m_Renderer2D.BeginScene(this.m_Camera2D);
        this.idleAnimation.GetCurrentUVs();
        console.log(this.idleAnimation.GetSprite().UVs)
        this.m_Renderer2D.DrawSprite(this.position, this.size, new Vector4(0,0,0,1), this.idleAnimation.GetSprite());
    }

    protected OnUpdate(deltaTime: number): void
    {
        this.idleAnimation.Update(deltaTime);
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
