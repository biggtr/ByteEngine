import { Entity, ENTITY_TYPE } from "./Entity";

class EntityManager
{
    private m_Entities: Array<Entity> = [];
    private m_SortedEntities: Map<ENTITY_TYPE, Array<Entity>> = new Map()

 
    public RegisterEntity(newEntity: Entity)
    {
        this.m_Entities.push(newEntity);

        const entityType = newEntity.GetType();
        if(this.m_SortedEntities.has(entityType))
        {
            this.m_SortedEntities.get(entityType)?.push(newEntity);
        }
        else
        {
            this.m_SortedEntities.set(entityType, [newEntity]);
        }
            
    }
}
