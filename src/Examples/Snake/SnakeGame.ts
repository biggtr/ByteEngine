import { Application } from "@/Core/Application";
import { Vector3, Vector4 } from "@/Math/Vectors";
import { Animation, AnimationManager, CreateAnimationClip } from "@/Animation/Animation";
import { EntityManager } from "@/Scene/EntityManager";
import { ENTITY_TYPE } from "@/Scene/Entity";
import { COMPONENT_TYPE, CPhysicsBody, CSprite, } from "@/Scene/Components";
import { HANDLER_TYPE } from "@/ResourceManagement/ResourceManager";
import { SPRITE_TYPE } from "@/Renderer/Renderer2D";
import { BytePhysics } from "@/Physics/PhysicsSystem";

function GetRandomNumber(min: number, max: number): number
{
    return Math.floor(Math.random() * (max - min)) + min;
}

let Direction: Vector3 = new Vector3(1, 0, 0);
const WALL_SIZE: Vector3 = new Vector3(50, 600, 0);
export class SnakeGame extends Application
{
    private m_EntityManager!: EntityManager;
    private Snake!: number;
    private SnakeSize = new Vector3(25, 25, 1);
    private SnakePosition: Vector3 = new Vector3(0,0,-5);
    private SnakeColor: Vector4 = new Vector4(1.0, 0.0, 0.3, 1.0);
    private SnakeSegments!: Vector3[];
    private SnakeLength: number = 1;

    private FoodPosition: Vector3 = new Vector3(GetRandomNumber(-280, 280), GetRandomNumber(-100, 100), -5); 
    private FoodSize: Vector3 = new Vector3(10, 10, 1);
    private FoodColor: Vector4 = new Vector4(0.0, 0.0, 1.0, 1.0);
    private SnakeFood!: number;
    protected async OnInit(): Promise<void>
    {
        this.m_EntityManager = new EntityManager();

        this.Snake = this.m_EntityManager.AddEntity(ENTITY_TYPE.PLAYER);
        const SnakePhysicsBody = this.m_EntityManager.AddComponent(this.Snake, COMPONENT_TYPE.PHYSICS);
        SnakePhysicsBody.Position = new Vector3(0,0,-5);
        SnakePhysicsBody.Velocity = new Vector3(10,10, 0);

        this.SnakeFood = this.m_EntityManager.AddEntity(ENTITY_TYPE.ENEMY);
        this.m_EntityManager.AddComponent(this.SnakeFood, COMPONENT_TYPE.TRANFORM);
        this.m_BytePhysics.AddBody(SnakePhysicsBody);
        this.SnakeSegments = [];
        this.SnakeSegments.push(SnakePhysicsBody.Position);
    }

    protected OnRender(): void
    {
        this.m_Renderer2D.BeginScene(this.m_Camera2D);

        const food = this.m_EntityManager.GetComponent(this.SnakeFood, COMPONENT_TYPE.TRANFORM);
        if(food)
        {
            this.m_Renderer2D.DrawQuad(this.FoodPosition, this.FoodSize, this.FoodColor, SPRITE_TYPE.DYNAMIC);
        }
        // Draw left wall
        this.m_Renderer2D.DrawQuad(
            new Vector3(-this.m_Width / 2 + WALL_SIZE.x / 2, 0, -10),
            WALL_SIZE,
            new Vector4(1.0, 0.0, 0.0, 1.0),
            SPRITE_TYPE.DYNAMIC
        );

        // Draw right wall
        this.m_Renderer2D.DrawQuad(
            new Vector3(this.m_Width / 2 - WALL_SIZE.x / 2, 0, -10),
            WALL_SIZE,
            new Vector4(1.0, 0.0, 0.0, 1.0),
            SPRITE_TYPE.DYNAMIC
        );

        // Draw top wall
        this.m_Renderer2D.DrawQuad(
            new Vector3(0, this.m_Height / 2 - WALL_SIZE.x / 2, -10),
            new Vector3(this.m_Width, WALL_SIZE.x, 0),
            new Vector4(1.0, 0.0, 0.0, 1.0),
            SPRITE_TYPE.DYNAMIC
        );

        // Draw bottom wall
        this.m_Renderer2D.DrawQuad(
            new Vector3(0, -this.m_Height / 2 + WALL_SIZE.x / 2, -10),
            new Vector3(this.m_Width, WALL_SIZE.x, 0),
            new Vector4(1.0, 0.0, 0.0, 1.0),
            SPRITE_TYPE.DYNAMIC
        );

        // Draw Snake
        for(let i = 0; i < this.SnakeSegments.length; i++)
        {
            this.m_Renderer2D.DrawQuad(this.SnakeSegments[i],
                                       this.SnakeSize,
                                       this.SnakeColor, SPRITE_TYPE.DYNAMIC);
        }

        this.m_Renderer2D.EndScene();
    }

    protected OnUpdate(deltaTime: number): void
    {
        const physicsBody: CPhysicsBody = this.m_EntityManager.GetComponent(this.Snake, COMPONENT_TYPE.PHYSICS) as CPhysicsBody;


        if (this.m_Input.IsKeyPressed("KeyW") && Direction.y !== -1) {
            Direction = new Vector3(0, 1, 0);
        }
        if (this.m_Input.IsKeyPressed("KeyS") && Direction.y !== 1) {
            Direction = new Vector3(0, -1, 0);
        }
        if (this.m_Input.IsKeyPressed("KeyA") && Direction.x !== 1) {
            Direction = new Vector3(-1, 0, 0);
        }
        if (this.m_Input.IsKeyPressed("KeyD") && Direction.x !== -1) {
            Direction = new Vector3(1, 0, 0);
        }

        physicsBody.Velocity = Vector3.Multiply(Direction, 180)
        const newPlayerPosition : Vector3 = physicsBody!.Position;

        // wall detection
        if(newPlayerPosition.x < - this.m_Width / 2 + WALL_SIZE.x ||
           newPlayerPosition.x > this.m_Width / 2 - WALL_SIZE.x ||
           newPlayerPosition.y  > this.m_Height / 2 - WALL_SIZE.x ||
           newPlayerPosition.y  < -this.m_Height / 2 + WALL_SIZE.x
          )
        {
            physicsBody!.Position = new Vector3(0, 0, -5)
            this.SnakeSegments = [new Vector3(0, 0, -5)]
            console.log("Lost")
        }

        if(newPlayerPosition.Distance(this.FoodPosition) < this.FoodSize.x)
        {
            this.FoodPosition = new Vector3(GetRandomNumber(-280, 280), GetRandomNumber(-100, 100), -5); 
            const lastSegment = this.SnakeSegments[this.SnakeLength - 1];
            this.SnakeSegments.push(lastSegment); // add new segment with the last segment position
        }

        this.SnakeSegments[0] = newPlayerPosition;
        for(let i = this.SnakeSegments.length - 1; i > 0; i--)
        {
            this.SnakeSegments[i] = this.SnakeSegments[i - 1];
        }
        this.m_Camera2D.SetPosition(new Vector3(0, 0, -1));
    }
}
