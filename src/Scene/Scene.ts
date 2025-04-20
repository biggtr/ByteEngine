import { EngineComponents } from "@/Core/Application";
import { EntityManager } from "./EntityManager";
import { Action } from "./Actions";

export abstract class Scene
{
    protected m_GameEngine: EngineComponents;
    protected m_EntityManager: EntityManager;
    protected m_CurrentFrame: number = 0;
    protected m_HasEnded: boolean = false;
    protected m_Paused: boolean = false;

    constructor(engineComponents: EngineComponents)
    {
        this.m_GameEngine = engineComponents;
        this.m_EntityManager = new EntityManager();
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
    
    protected abstract OnInit(): void;
    protected abstract OnUpdate(deltaTime: number): void;
    protected abstract OnRender(): void;
    protected abstract OnAction(action: Action): void;
    

}
