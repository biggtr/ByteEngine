export enum ENTITY_TYPE
{

}


export abstract class Entity 
{
    private m_Type: ENTITY_TYPE;
    private m_IsAlive: boolean;
    private m_ID!: number;
    
    constructor(entityType: ENTITY_TYPE)
    {
        this.m_Type = entityType;
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


    public IsAlive(): boolean
    {
        return this.m_IsAlive;
    }
    public Destroy(): void
    {
        this.m_IsAlive = false;
    }

    
}
