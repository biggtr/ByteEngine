import { Application, EngineComponents } from "@/Core/Application";
import { Input } from "@/Input/Inputs";
import { Vector3, Vector4 } from "@/Math/Vectors";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { Renderer2D } from "@/Renderer/Renderer2D";
import { HANDLER_TYPE, ResourceManager } from "@/ResourceManagement/ResourceManager";
import { Animation, AnimationManager, CreateAnimationClip } from "@/Animation/Animation";
import { ResourceHandler } from "@/ResourceManagement/ResourceHandlers";
import { Shader } from "@/Renderer/Shader";
import { RENDERER_API, RendererAPI } from "@/Renderer/RendererAPI";
import { EntityManager } from "@/Scene/EntityManager";
import { ENTITY_TYPE } from "@/Scene/Entity";
import { CAnimation, COMPONENT_TYPE, CSprite } from "@/Scene/Components";
import { Texture } from "@/Renderer/Texture";
import { Matrix4 } from "@/Math/Matrices";

var basicTexture: Texture;
var idleAnimation: Animation;
var attackAnimation: Animation;
var runAnimation: Animation;

var PLAYER_SIZE = new Vector3(400, 400, 1);
var playerPosition = new Vector3(0,0,-5);
//Ugly Class Will remove it in future just for testing 
export class TestGame extends Application
{
    private m_Renderer2D!: Renderer2D;
    private m_Input!: Input;
    private m_Camera2D!: OrthographicCamera;
    private m_ResourceManager!: ResourceManager;
    private m_EntityManager!: EntityManager;
    private m_AnimationManager!: AnimationManager
    private m_Player!: number;
    private m_IsFaceLeft: boolean = false;

    protected async OnInit(engineComponents: EngineComponents): Promise<void>
    {
        if(!engineComponents.Renderer2D || !engineComponents.InputSystem || !engineComponents.OrthoCamera || !engineComponents.ResourceManager)
        {
            throw new Error("EngineComponents not initialized properly..");
        }
        const A = Matrix4.Translate(10, 0, 0);
        const B = Matrix4.Rotate(0, 0, 90);
        console.log( A.Multiply(B) );
        this.m_Renderer2D = engineComponents.Renderer2D;
        this.m_Input = engineComponents.InputSystem;
        this.m_Camera2D = engineComponents.OrthoCamera;
        this.m_Camera2D.SetPosition(new Vector3(0,0,-1));
        this.m_ResourceManager = engineComponents.ResourceManager;
        this.m_EntityManager = new EntityManager();
        this.m_AnimationManager = new AnimationManager()

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
        
        const idleTexture = textureManager.Get("idle");
        const runTexture = textureManager.Get("run");
        const attackTexture = textureManager.Get("attack");
        // console.log(this.sprite.UVs)
        this.m_Player = this.m_EntityManager.AddEntity(ENTITY_TYPE.PLAYER);
        const sprite = this.m_EntityManager.AddComponent(this.m_Player, COMPONENT_TYPE.SPRITE)
        const playerAnimations = this.m_EntityManager.AddComponent(this.m_Player, COMPONENT_TYPE.ANIMATION);
        if(sprite)
        {
            sprite.Texture = idleTexture;
        }

        
        idleAnimation = CreateAnimationClip("Idle", idleTexture, 10, 32, 32, 0.01, 320, 32);
        this.SetAnimationClip("Idle")
        runAnimation = CreateAnimationClip("Run", runTexture, 16, 32, 32, 0.01, 512,32)
        attackAnimation = CreateAnimationClip("Attack", attackTexture, 7, 32, 32, 0.06, 224,32)
        playerAnimations?.Animations.set(idleAnimation.m_Name, idleAnimation);
        playerAnimations?.Animations.set(runAnimation.m_Name, runAnimation);
        playerAnimations?.Animations.set(attackAnimation.m_Name, attackAnimation);
    }

    protected OnRender(): void
    {        
        
        const sprite = this.m_EntityManager.GetComponent(this.m_Player, COMPONENT_TYPE.SPRITE);
      
        this.m_Renderer2D.BeginScene(this.m_Camera2D);
        const renderSize = new Vector3(
        this.m_IsFaceLeft ? -PLAYER_SIZE.x : PLAYER_SIZE.x,
        PLAYER_SIZE.y,
        PLAYER_SIZE.z
        );    
        // this.m_Renderer2D.DrawQuad(new Vector3(0, 0, -5), PLAYER_SIZE,
        // new Vector4(1, 0, 0, 1));   // z = –5
        if(sprite)
            this.m_Renderer2D.DrawSprite(playerPosition, PLAYER_SIZE, new Vector4(1,0,0,0), sprite);
        this.m_Renderer2D.EndScene();
      
    }

    protected OnUpdate(deltaTime: number): void
    {
        // console.log("Player Position:", playerPosition);
        // console.log("Camera Position:", this.m_Camera2D.GetPosition());
        const anim = this.m_EntityManager.GetComponent(this.m_Player, COMPONENT_TYPE.ANIMATION);
        const sprite = this.m_EntityManager.GetComponent(this.m_Player, COMPONENT_TYPE.SPRITE);

        if(anim && sprite)
        {
            const currentClip = anim.Animations.get(anim.ActiveClip);
            if(currentClip)
            {
                this.m_AnimationManager.Update(currentClip, sprite, deltaTime);
            }

        }
        var movement = new Vector3(0,0,0);
        // const prevCameraPosition: Vector3 = this.m_Camera2D.GetPosition();
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
          this.m_IsFaceLeft = true;
        }
        if (this.m_Input.IsKeyPressed("KeyD")) 
        {
          movement.x += moveSpeed * deltaTime; 
          this.m_IsFaceLeft = false;
        }

        if(movement.x !== 0 || movement.y !== 0)
        {
            this.SetAnimationClip("Run");
        }
        else
        {
            this.SetAnimationClip("Idle")
        }
        playerPosition = Vector3.Add(playerPosition, movement);
        this.m_Camera2D.SetPosition(new Vector3(playerPosition.x, playerPosition.y, -1));
    }
    private SetAnimationClip(name: string): void
    {
        const anim = this.m_EntityManager.GetComponent(this.m_Player, COMPONENT_TYPE.ANIMATION);
        if(anim && anim.ActiveClip !== name)
        {
            anim.ActiveClip = name;
            const clip = anim.Animations.get(anim.ActiveClip);
            if(clip)
            {
                clip!.m_CurrentFrame = 0;
                clip!.m_ElapsedTime = 0;    
            }
        }

    }
}
