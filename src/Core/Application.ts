import { Input } from "@/Input/Inputs";
import { Vector3, Vector4 } from "@/Math/Vectors";
import { BytePhysics } from "@/Physics/PhysicsSystem";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { Renderer2D } from "@/Renderer/Renderer2D";
import { RENDERER_API, RendererAPI } from "@/Renderer/RendererAPI";
import { HANDLER_TYPE, ResourceManager } from "@/ResourceManagement/ResourceManager";

const FIXED_TIME_STEP: number = 1/60;
export interface EngineComponents
{
    Renderer2D?: Renderer2D;
    OrthoCamera?: OrthographicCamera;
    ResourceManager?: ResourceManager;
}
export abstract class Application 
{

    private m_AccumulatedTime: number;
    private m_LastTime: number;
    protected m_IsRunning: boolean;
    protected m_Input!: Input;
    protected m_BytePhysics!: BytePhysics;
    protected m_Renderer2D!: Renderer2D;
    protected m_Camera2D!: OrthographicCamera;
    protected m_ResourceManager!: ResourceManager;
    protected m_Width!: number;
    protected m_Height!: number;
    constructor()
    {
        this.m_AccumulatedTime = 0
        this.m_LastTime = 0;
        this.m_IsRunning = false;
    }

    public async Init(width: number, height:number, engineComponents: EngineComponents): Promise<void> 
    {
        this.m_Width = width;
        this.m_Height = height;
        this.m_Input = new Input();
        this.m_Input.Initialize();
        this.m_BytePhysics = new BytePhysics();
        if(
           !engineComponents.Renderer2D || 
           !engineComponents.OrthoCamera ||
           !engineComponents.ResourceManager
          )
        {
            throw new Error("EngineComponents not initialized properly..");
        }
        this.m_Renderer2D = engineComponents.Renderer2D;
        this.m_Camera2D = engineComponents.OrthoCamera;
        this.m_Camera2D.SetPosition(new Vector3(0,0,-1));
        this.m_ResourceManager = engineComponents.ResourceManager;
        const shaderManager = this.m_ResourceManager.GetHandler(HANDLER_TYPE.SHADER); 
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
        await this.OnInit();
    }

    public Run()
    {
         
        this.m_LastTime = performance.now();  //get the time after the first frame is drawn 
        this.m_IsRunning = true;

        requestAnimationFrame((timeStamp) => this.GameLoop(timeStamp));
    }
    private GameLoop(currentTime: number): void
    {
        var deltaTime = (currentTime - this.m_LastTime) / 1000; //dividing by 1000 to convert from ms to seconds
        this.m_LastTime = currentTime;
        this.m_AccumulatedTime += deltaTime;
        
        let updated = false;
        while(this.m_AccumulatedTime >= FIXED_TIME_STEP)
        {
            
            this.Update(FIXED_TIME_STEP);
            this.m_AccumulatedTime -= FIXED_TIME_STEP;
            updated = true;

        }
        
        if(updated)
        {
            this.Render();
        }
        
        if(this.m_IsRunning)
        {
            requestAnimationFrame((timeStamp) => this.GameLoop(timeStamp));
        }

    }
    public Update(deltaTime: number): void
    {
        this.m_BytePhysics.Process(deltaTime);
        this.OnUpdate(deltaTime);
    }

    public Render(): void 
    {
        this.m_Renderer2D.Clear();
        this.m_Renderer2D.SetClearColor(new Vector4(1,1,1,1));
        this.OnRender();
    }

    //Functions that will be overwritten 
    protected abstract OnInit(): Promise<void>;
    protected abstract OnRender(): void;
    protected abstract OnUpdate(deltaTime: number): void;

}

