import { Entity, ENTITY_TYPE } from "./Entity";

class EntityManager
{
    private m_EntitiesQueue: Entity[] = [];
    private m_Entities: Entity[] = [];
    private m_SortedEntities: Map<ENTITY_TYPE, Entity[]> = new Map()
    private m_TotalNumEntities: number = 0;

 
    public AddEntity(entityType: ENTITY_TYPE): Entity 
    {
        // for iterator invalidation we add new entity to queue and in update we add to m_Entities
        const newEntity: Entity = new Entity(entityType, this.m_TotalNumEntities++);

        this.m_EntitiesQueue.push(newEntity);

            
        return newEntity;
    }

    public GetEntities(): Entity[]
    {
        return this.m_Entities;
    }
    
    public Update()
    {
        //Update the m_Entities each frame when calling this method that adds entities in queue to m_Entities

        for(const entity of this.m_EntitiesQueue)
        {
            this.m_Entities.push(entity);
            const entityType = entity.GetType();
            if(this.m_SortedEntities.has(entityType))
            {
                this.m_SortedEntities.get(entityType)?.push(entity);
            }
            else
            {
                this.m_SortedEntities.set(entityType, [entity]);
            }
        }

        //Clear All dead entities and entityqueue
        this.m_EntitiesQueue = [];
        this.m_Entities = this.m_Entities.filter(entity => entity.IsAlive());
        this.RemoveDeadEntitiesFromSorted();
    }

    private RemoveDeadEntitiesFromSorted()
    {
        const updatedSortedEntities = new Map<ENTITY_TYPE, Entity[]>();
        for(const [entityType, entities] of this.m_SortedEntities)
        {
            const aliveEntities = entities.filter(entity => entity.IsAlive());
            updatedSortedEntities.set(entityType, aliveEntities);
        }
        this.m_SortedEntities = updatedSortedEntities;
    }
}
