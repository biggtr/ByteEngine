import { Component } from "./Components";

export enum ENTITY_TYPE
{
    ENEMY, PLAYER, BULLET
}


export class Entity 
{
    private m_Components: Set<Component> = new Set<Component>();
    private m_Type: ENTITY_TYPE;
    private m_IsAlive: boolean;
    private m_ID!: number;
    
    constructor(entityType: ENTITY_TYPE, id: number)
    {
        this.m_Type = entityType;
        this.m_ID = id;
        this.m_IsAlive = true;
    }
    

    public SetID(newID: number): void
    {
        this.m_ID = newID;
    }
    public GetID(): number
    {
        return this.m_ID
    }
    public GetType(): ENTITY_TYPE
    {
        return this.m_Type;
    }

    public AddComponents(newComponent: Component)
    {
        this.m_Components.add(newComponent);
    }

    public IsAlive(): boolean
    {
        return this.m_IsAlive;
    }
    public Destroy(): void
    {
        this.m_IsAlive = false;
    }

    
}

