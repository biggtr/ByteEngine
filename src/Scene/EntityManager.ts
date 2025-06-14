import { CAnimation, Component, COMPONENT_TYPE, CSprite, CTransform } from "./Components";
import { Entity, ENTITY_TYPE } from "./Entity";


// alot of memory waste cuz some indexes is gonna be empty to solve use maps but its slower
interface SparseSet<T extends Component>
{
    Dense: T[];
    Sparse: number[]; // index to component in the dense array at inx: 5 => 3 == entity_5's component is at index 3 in dense array
}
function CreateComponent(componentType: COMPONENT_TYPE): Component
{
    switch(componentType)
    {
        case COMPONENT_TYPE.SPRITE:
            return new CSprite();
        case COMPONENT_TYPE.TRANFORM:
            return new CTransform();
        case COMPONENT_TYPE.ANIMATION:
            return new CAnimation();
    }
}
export class EntityManager
{
    private m_Entities: Entity[] = [];
    private Components: Map<COMPONENT_TYPE, SparseSet<Component>> = new Map(); 
    
    
    private m_TotalNumEntities: number = 0;

 
    public AddEntity(entityType: ENTITY_TYPE): number 
    {
        // for iterator invalidation we add new entity to queue and in update we add to m_Entities
        const entityIndex = this.m_TotalNumEntities;
        const newEntity: Entity = new Entity(entityType, this.m_TotalNumEntities++);
        this.m_Entities.push(newEntity);
        return entityIndex;
    }


    public AddComponent(entityId: number, componentType: COMPONENT_TYPE): Component | null
    {
        const entity = this.m_Entities[entityId];
        // if entity has the comp already return
        if(entity.HasSpecComponent(componentType))
        {
            return null;
        }
        entity.ComponentMask |= componentType;

        const newComponent = CreateComponent(componentType);
        let sparseSet = this.Components.get(componentType);
        if(!sparseSet)
        {
            sparseSet = {
                Dense: [],
                Sparse: [],
            }
            this.Components.set(componentType, sparseSet);
        }
        const denseIndex = sparseSet?.Dense.length;
        sparseSet?.Dense.push(newComponent);
        sparseSet.Sparse[entityId] = denseIndex;
        return newComponent;
    }
    
    public GetComponent<T extends Component>(entityId: number, componentType: COMPONENT_TYPE): T | null 
    {
        const entity = this.m_Entities[entityId];

        if(!entity.HasSpecComponent(componentType))
        {
            return null;
        }

        const sparseSet = this.Components.get(componentType);
        if(!sparseSet) return null
        const denseIndex = sparseSet.Sparse[entityId];
        if(denseIndex == undefined) return null;
        return sparseSet?.Dense[denseIndex] as T;

    }
    

}
