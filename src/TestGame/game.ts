import { Application, EngineComponents } from "@/Core/Application";
import { Input } from "@/Input/Inputs";
import { Vector3, Vector4 } from "@/Math/Vectors";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { Renderer2D, Sprite } from "@/Renderer/Renderer2D";
import { HANDLER_TYPE, ResourceManager } from "@/ResourceManagement/ResourceManager";
import { Animation } from "@/Animation/Animation";

var BasicSprite: Sprite; 
var idleAnimation: Animation;
var attackAnimation: Animation;
var runAnimation: Animation;

//Ugly Class Will remove it in future just for testing 
export class TestGame extends Application
{
    private m_Renderer2D!: Renderer2D;
    private m_Input!: Input;
    private m_Camera2D!: OrthographicCamera;
    private m_ResourceManager!: ResourceManager;
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
        await textureManager.Load("idle", "/assets/textures/Sprites/IDLE.png");
        await textureManager.Load("run", "/assets/textures/Sprites/RUN.png");
        await textureManager.Load("attack", "/assets/textures/Sprites/ATTACK 1.png");

        await textureManager.Load("basic", "/assets/textures/basic.png");

        const shaderManager = this.m_ResourceManager.GetHandler(HANDLER_TYPE.SHADER);
        await shaderManager.Load("Quad", "/assets/shaders/QuadShader.glsl");
        await shaderManager.Load("Sprite", "/assets/shaders/SpriteShader.glsl");
        this.m_Renderer2D.Init(
            {
                quadShader: shaderManager.Get("Quad"),
                spriteShader: shaderManager.Get("Sprite") 
            }
        )
        
        const idleTexture = textureManager.Get("idle");
        const runTexture = textureManager.Get("run");
        const attackTexture = textureManager.Get("attack");
        // console.log(this.sprite.UVs)
        idleAnimation = new Animation("Idle",10,0.01,32,32,new Sprite(idleTexture, new Vector3(320, 32, 1))) //10 frames
        runAnimation = new Animation("Run", 16, 0.01,32,32, new Sprite(runTexture, new Vector3(512,32,1))); // 16 frames
        attackAnimation = new Animation("Attack", 1, 0.06,32,32, new Sprite(attackTexture, new Vector3(224,32,1)));
        const BasicTexture = this.m_ResourceManager.GetHandler(HANDLER_TYPE.TEXTURE).Get("basic");
        BasicSprite = new Sprite(BasicTexture);
    }

    protected OnRender(): void
    {
        this.m_Renderer2D.BeginScene(this.m_Camera2D);
        idleAnimation.GetCurrentUVs();
        runAnimation.GetCurrentUVs()
        attackAnimation.GetCurrentUVs();
        // console.log(this.idleAnimation.GetSprite().UVs)
        this.m_Renderer2D.DrawSprite(new Vector3(200,100,1), this.size, new Vector4(0,0,0,1), idleAnimation.GetSprite());
        this.m_Renderer2D.DrawSprite(new Vector3(400,100,1), this.size, new Vector4(0,0,0,1), runAnimation.GetSprite());
        this.m_Renderer2D.DrawSprite(new Vector3(600,100,1), this.size, new Vector4(0,0,0,1), attackAnimation.GetSprite());
        this.m_Renderer2D.DrawSprite(new Vector3(700,100,1), this.size, new Vector4(0,0,0,1), BasicSprite) 
       
    }

    protected OnUpdate(deltaTime: number): void
    {
        idleAnimation.Update(deltaTime);
        runAnimation.Update(deltaTime);
        attackAnimation.Update(deltaTime);
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
