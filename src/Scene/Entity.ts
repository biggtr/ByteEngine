
export enum ENTITY_TYPE
{
    ENEMY, PLAYER 
}


export class Entity 
{
    public Type: ENTITY_TYPE;
    public ID!: number;
    public ComponentMask: number;

    
    constructor(entityType: ENTITY_TYPE, id: number)
    {
        this.Type = entityType;
        this.ID = id;
        this.ComponentMask = 0; // doesnt have any comps yet
    }
    
    public HasComponents(mask: number): boolean
    {
        return (this.ComponentMask & mask) === mask; //0111(trans, anim, sprite) && 0001(sprite) => 0001 == 0001
    }
    public HasSpecComponent(indivualComponent: number)
    {
        return (this.ComponentMask & indivualComponent) !== 0;
    }
    
}

