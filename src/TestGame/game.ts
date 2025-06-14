import { Application, EngineComponents } from "@/Core/Application";
import { Input } from "@/Input/Inputs";
import { Vector3, Vector4 } from "@/Math/Vectors";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { Renderer2D } from "@/Renderer/Renderer2D";
import { HANDLER_TYPE, ResourceManager } from "@/ResourceManagement/ResourceManager";
import { Animation } from "@/Animation/Animation";
import { ResourceHandler } from "@/ResourceManagement/ResourceHandlers";
import { Shader } from "@/Renderer/Shader";
import { RENDERER_API, RendererAPI } from "@/Renderer/RendererAPI";
import { EntityManager } from "@/Scene/EntityManager";
import { ENTITY_TYPE } from "@/Scene/Entity";
import { CAnimation, COMPONENT_TYPE, CSprite } from "@/Scene/Components";
import { Texture } from "@/Renderer/Texture";

var basicTexture: Texture;
// var idleAnimation: Animation;
// var attackAnimation: Animation;
// var runAnimation: Animation;

//Ugly Class Will remove it in future just for testing 
export class TestGame extends Application
{
    private m_Renderer2D!: Renderer2D;
    private m_Input!: Input;
    private m_Camera2D!: OrthographicCamera;
    private m_ResourceManager!: ResourceManager;
    private m_EntityManager!: EntityManager;
    private size = new Vector3(200, 200, 1);
    private m_Player: number;
    private m_PlayerSprite: CSprite;

    protected async OnInit(engineComponents: EngineComponents): Promise<void>
    {
        if(!engineComponents.Renderer2D || !engineComponents.InputSystem || !engineComponents.OrthoCamera || !engineComponents.ResourceManager)
        {
            throw new Error("EngineComponents not initialized properly..");
        }
        this.m_Renderer2D = engineComponents.Renderer2D;
        this.m_Input = engineComponents.InputSystem;
        this.m_Camera2D = engineComponents.OrthoCamera;
        this.m_Camera2D.SetPosition(new Vector3(-300,-200,1))
        this.m_ResourceManager = engineComponents.ResourceManager;
        this.m_EntityManager = new EntityManager();

        const textureManager = this.m_ResourceManager.GetHandler(HANDLER_TYPE.TEXTURE);
        await textureManager.Load("idle", "/assets/textures/Sprites/IDLE.png");
        await textureManager.Load("run", "/assets/textures/Sprites/RUN.png");
        await textureManager.Load("attack", "/assets/textures/Sprites/ATTACK 1.png");

        await textureManager.Load("basic", "/assets/textures/basic.png");

        const shaderManager = this.m_ResourceManager.GetHandler(HANDLER_TYPE.SHADER) as ResourceHandler<Shader>;
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                await shaderManager.Load("Quad", "/assets/shaders/Quad.glsl");
                await shaderManager.Load("Sprite", "/assets/shaders/Sprite.glsl");
                break;
            case RENDERER_API.WEBGPU:
                await shaderManager.Load("Quad", "/assets/shaders/Quad.wgsl");
                await shaderManager.Load("Sprite", "/assets/shaders/Sprite.wgsl");
                break;
        }
        this.m_Renderer2D.Init(
            {
                quadShader: shaderManager.Get("Quad"),
                spriteShader: shaderManager.Get("Sprite") 
            }
        )
        
        // const idleTexture = textureManager.Get("idle");
        // const runTexture = textureManager.Get("run");
        // const attackTexture = textureManager.Get("attack");
        // console.log(this.sprite.UVs)
        this.m_Player = this.m_EntityManager.AddEntity(ENTITY_TYPE.PLAYER);
        this.m_PlayerSprite = this.m_EntityManager.AddComponent(this.m_Player, COMPONENT_TYPE.SPRITE); // change it to generic rather than casting to right component type each time 
        // const playerAnimations = this.m_EntityManager.AddComponent(player, COMPONENT_TYPE.ANIMATION) as CAnimation;

        basicTexture = this.m_ResourceManager.GetHandler(HANDLER_TYPE.TEXTURE).Get("basic");
        this.m_PlayerSprite.Texture = basicTexture;
        // idleAnimation = new Animation("Idle",10,0.01,32,32,new Sprite(idleTexture, new Vector3(320, 32, 1))) //10 frames
        // runAnimation = new Animation("Run", 16, 0.01,32,32, new Sprite(runTexture, new Vector3(512,32,1))); // 16 frames
        // attackAnimation = new Animation("Attack", 7, 0.06,32,32, new Sprite(attackTexture, new Vector3(224,32,1)));
    }

    protected OnRender(): void
    {
        this.m_Renderer2D.BeginScene(this.m_Camera2D);
        // this.m_Renderer2D.DrawSprite(new Vector3(0,100,1), this.size, new Vector4(0,0,0,1), idleAnimation.m_Sprite);
        // this.m_Renderer2D.DrawSprite(new Vector3(200,100,1), this.size, new Vector4(0,0,0,1), runAnimation.m_Sprite);
        // this.m_Renderer2D.DrawSprite(new Vector3(400,100,1), this.size, new Vector4(0,0,0,1), attackAnimation.m_Sprite);
        this.m_Renderer2D.DrawSprite(new Vector3(600,100,1), this.size, new Vector4(0,0,0,1), this.m_PlayerSprite) 
        this.m_Renderer2D.DrawSprite(new Vector3(500,400,1), this.size, new Vector4(0,0,0,1), this.m_PlayerSprite) 
        this.m_Renderer2D.DrawSprite(new Vector3(200,400,1), this.size, new Vector4(0,0,0,1), this.m_PlayerSprite) 
        this.m_Renderer2D.EndScene();
      
    }

    protected OnUpdate(deltaTime: number): void
    {
        // idleAnimation.Update(deltaTime);
        // runAnimation.Update(deltaTime);
        // attackAnimation.Update(deltaTime);
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
