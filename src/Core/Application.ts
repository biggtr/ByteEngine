import { Input } from "@/Input/Inputs";
import { OrthographicCamera } from "@/Renderer/Cameras";
import { Renderer2D } from "@/Renderer/Renderer2D";
import { ResourceManager } from "@/ResourceManagement/ResourceManager";
import { EntityManager } from "@/Scene/EntityManager";
import { markAsUntransferable } from "worker_threads";

const FIXED_TIME_STEP: number = 1/60;
export interface EngineComponents
{
    Renderer2D?: Renderer2D;
    InputSystem?: Input;
    OrthoCamera?: OrthographicCamera;
    ResourceManager?: ResourceManager;
}
export abstract class Application 
{

    private m_AccumulatedTime: number;
    private m_LastTime: number;
    protected m_IsRunning: boolean;
    constructor()
    {
        this.m_AccumulatedTime = 0
        this.m_LastTime = 0;
        this.m_IsRunning = false;
    }

    public async Init(engineComponents: EngineComponents): Promise<void> 
    {
        await this.OnInit(engineComponents);
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
        this.OnUpdate(deltaTime);
    }

    public Render(): void 
    {
        this.OnRender();
    }

    //Functions that will be overwritten 
    protected abstract OnInit(engineComponents: EngineComponents): void;
    protected abstract OnRender(): void;
    protected abstract OnUpdate(deltaTime: number): void;

}

