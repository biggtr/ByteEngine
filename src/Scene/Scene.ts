import { EngineComponents } from "@/Core/Application";
import { EntityManager } from "./EntityManager";

export abstract class Scene
{
    protected m_GameEngine: EngineComponents
    protected m_CurrentFrame: number = 0;
    protected m_HasEnded: boolean = false;
    protected m_Paused: boolean = false;

    constructor(engineComponents: EngineComponents)
    {
        this.m_GameEngine = engineComponents;
    }

    public Update(deltaTime: number): void
    {
        this.m_CurrentFrame++;
        this.OnUpdate(deltaTime);
    }
    public Render(): void
    {
        this.OnRender();
    }
    
    protected abstract OnUpdate(deltaTime: number): void;
    protected abstract OnRender(): void;
    

}
