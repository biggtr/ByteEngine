import { Application } from "@/Core/Application";
import { Vector3, Vector4 } from "@/Math/Vectors";
import { Animation, AnimationManager, CreateAnimationClip } from "@/Animation/Animation";
import { EntityManager } from "@/Scene/EntityManager";
import { ENTITY_TYPE } from "@/Scene/Entity";
import { COMPONENT_TYPE, CPhysicsBody, CSprite, } from "@/Scene/Components";
import { HANDLER_TYPE } from "@/ResourceManagement/ResourceManager";
import { SPRITE_TYPE } from "@/Renderer/Renderer2D";

var idleAnimation: Animation;
var attackAnimation: Animation;
var runAnimation: Animation;
var staticSprite: CSprite = new CSprite();
var PLAYER_SIZE = new Vector3(150, 150, 1);

var playerPosition: Vector3 = new Vector3(0,0,-5);
const PUSH_FORCE = new Vector3(0,0);

interface TileMap
{
    CountX: number;
    CountY: number;
    Width: number;
    Height: number;
    Tiles: number[][];
    TileWidth: number;
    TileHeight: number;
    OffsetX: number;
    OffsetY: number;
}

function IsTileMapPointEmpty(tileMap: TileMap, pointX: number, pointY: number): boolean
{
    let empty: boolean = false;
    const playerTileX = Math.floor((pointX  - tileMap.OffsetX)/ tileMap.TileWidth);
    const playerTileY = Math.floor((pointY  - tileMap.OffsetY)/ tileMap.TileHeight);

    if(playerTileX >= 0 && playerTileX < TILEMAP_COUNT_X && playerTileY >= 0 && playerTileY < TILEMAP_COUNT_Y)
    {
        const tileMapValue = tileMap.Tiles[playerTileY][playerTileX];
        if(tileMapValue == 0)
            empty = true;
    }
    return empty;
}
const TILEMAP_COUNT_X = 17;
const TILEMAP_COUNT_Y = 9;
const map: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const tileWidth = 70;
const tileHeight = 70;
const mapWidth = TILEMAP_COUNT_X * tileWidth;
const mapHeight = TILEMAP_COUNT_Y * tileHeight; 
const tileMap: TileMap = {
    Tiles: map,
    CountX : TILEMAP_COUNT_X,
    CountY : TILEMAP_COUNT_Y,
    TileWidth: tileWidth,
    TileHeight: tileHeight,
    Width: mapWidth,
    Height: mapHeight,
    OffsetX: 0,
    OffsetY: 0
}
tileMap.OffsetX = -tileMap.Width * 0.5 + tileMap.TileWidth * 0.5; 
tileMap.OffsetY = -tileMap.Height * 0.5 + tileMap.TileHeight * 0.5;

export class TestGame extends Application
{
    private m_EntityManager!: EntityManager;
    private m_AnimationManager!: AnimationManager;
    private m_Player!: number;
    private m_IsFaceLeft: boolean = false;

    protected async OnInit(): Promise<void>
    {
        
        this.m_EntityManager = new EntityManager();
        this.m_AnimationManager = new AnimationManager()

        const textureManager = this.m_ResourceManager.GetHandler(HANDLER_TYPE.TEXTURE);
        const idleTexture = await textureManager.Load("idle", "/assets/textures/Sprites/IDLE.png");
        const runTexture = await textureManager.Load("run", "/assets/textures/Sprites/RUN.png");
        const attackTexture = await textureManager.Load("attack", "/assets/textures/Sprites/ATTACK 1.png");
        await textureManager.Load("basic", "/assets/textures/basic.png");
        
        this.m_Player = this.m_EntityManager.AddEntity(ENTITY_TYPE.PLAYER);
        const sprite = this.m_EntityManager.AddComponent(this.m_Player, COMPONENT_TYPE.SPRITE)
        const physicsBody = this.m_EntityManager.AddComponent(this.m_Player, COMPONENT_TYPE.PHYSICS);
        physicsBody.Position = new Vector3(0,0,-5);
        physicsBody.Velocity = new Vector3(10,10, 0);
        this.m_BytePhysics.AddBody(physicsBody);

        const playerAnimations = this.m_EntityManager.AddComponent(this.m_Player, COMPONENT_TYPE.ANIMATION);
        if(sprite)
        {
            sprite.Texture = idleTexture;
        }

        
        idleAnimation = CreateAnimationClip("Idle", idleTexture, 10, 32, 32, 0.01, 320, 32);
        this.SetAnimationClip("Idle")
        runAnimation = CreateAnimationClip("Run", runTexture, 16, 32, 32, 0.01, 512,32)
        attackAnimation = CreateAnimationClip("Attack", attackTexture, 7, 32, 32, 0.06, 224,32)
        playerAnimations?.Animations.set(idleAnimation.m_Name, idleAnimation);
        playerAnimations?.Animations.set(runAnimation.m_Name, runAnimation);
        playerAnimations?.Animations.set(attackAnimation.m_Name, attackAnimation);

        staticSprite.Texture = idleTexture;
    }

    protected OnRender(): void
    {        
        const sprite = this.m_EntityManager.GetComponent(this.m_Player, COMPONENT_TYPE.SPRITE);
        
        
        this.m_Renderer2D.BeginScene(this.m_Camera2D);
        const renderSize = new Vector3(
        this.m_IsFaceLeft ? -PLAYER_SIZE.x : PLAYER_SIZE.x,
        PLAYER_SIZE.y,
        PLAYER_SIZE.z
        );    

        for (let row = 0; row < TILEMAP_COUNT_Y; row++) 
        {
            for (let col = 0; col < TILEMAP_COUNT_X; col++) 
            {
                if(tileMap.Tiles[row][col] == 1)
                {
                    const posX = col * tileMap.TileWidth + tileMap.OffsetX; 
                    const posY = row * tileMap.TileHeight + tileMap.OffsetY;
                    this.m_Renderer2D.DrawQuad(
                        new Vector3(posX, posY, -10),
                        new Vector3(tileMap.TileWidth, tileMap.TileHeight, 1),
                        new Vector4(1.0, 0.0, 1.0, 1.0),
                        SPRITE_TYPE.DYNAMIC
                    );
                }
            }
        }
        
        if(sprite)
        {
            let x, y = 0;
            for(let i = 0; i < 20000; i++)
            {
                x = (i % 50) * 100;
                y = (i / 50) * 100;

                this.m_Renderer2D.DrawSprite(
                    new Vector3(x, y, -5),
                    new Vector3(100, 100, 0),
                    new Vector4(1,1,1,1),
                    sprite,
                    SPRITE_TYPE.DYNAMIC
                )
            }
            this.m_Renderer2D.DrawSprite(playerPosition, renderSize, new Vector4(1,1,1, 1), sprite, SPRITE_TYPE.DYNAMIC);
        }
        this.m_Renderer2D.EndScene();
      
    }

    protected OnUpdate(deltaTime: number): void
    {
        PUSH_FORCE.x = 0;
        PUSH_FORCE.y = 0;
        const anim = this.m_EntityManager.GetComponent(this.m_Player, COMPONENT_TYPE.ANIMATION);
        const sprite = this.m_EntityManager.GetComponent(this.m_Player, COMPONENT_TYPE.SPRITE);
        const physicsBody = this.m_EntityManager.GetComponent(this.m_Player, COMPONENT_TYPE.PHYSICS);


        if(anim && sprite && physicsBody)
        {
            const currentClip = anim.Animations.get(anim.ActiveClip);
            if(currentClip)
            {
                this.m_AnimationManager.Update(currentClip, sprite, deltaTime);
            }

        }
        if (this.m_Input.IsKeyPressed("KeyW"))
        {
            PUSH_FORCE.y = 150;
        }
        if (this.m_Input.IsKeyPressed("KeyS"))
        {
            PUSH_FORCE.y = -150;
        }
        if (this.m_Input.IsKeyPressed("KeyA")) 
        {
            PUSH_FORCE.x = -150;
            this.m_IsFaceLeft = true;
        }
        if (this.m_Input.IsKeyPressed("KeyD")) 
        {
            PUSH_FORCE.x = 150;
            this.m_IsFaceLeft = false;
        }

        if (PUSH_FORCE.x !== 0 || PUSH_FORCE.y !== 0) 
        {
            // this.m_BytePhysics.AddForce(physicsBody as CPhysicsBody, PUSH_FORCE);
            physicsBody!.Velocity.x = PUSH_FORCE.x;
            physicsBody!.Velocity.y = PUSH_FORCE.y;
            this.SetAnimationClip("Run");
        } 
        else 
        {
            this.SetAnimationClip("Idle")
            physicsBody!.Velocity = new Vector3() 
        }
        const newPlayerPosition : Vector3 = physicsBody!.Position;

        // if(IsTileMapPointEmpty(tileMap, newPlayerPosition.x - 0.5 * PLAYER_SIZE.x , newPlayerPosition.y ) && 
        //   IsTileMapPointEmpty(tileMap, newPlayerPosition.x + 0.5 * PLAYER_SIZE.x, newPlayerPosition.y)  && 
        //   IsTileMapPointEmpty(tileMap, newPlayerPosition.x, newPlayerPosition.y) 
        //   )
        // {
        // }
        playerPosition = physicsBody!.Position;
        this.m_Camera2D.SetPosition(new Vector3(playerPosition.x, playerPosition.y, 5));
    }
    private SetAnimationClip(name: string): void
    {
        const anim = this.m_EntityManager.GetComponent(this.m_Player, COMPONENT_TYPE.ANIMATION);
        if(anim && anim.ActiveClip !== name)
        {
            anim.ActiveClip = name;
            const clip = anim.Animations.get(anim.ActiveClip);
            if(clip)
            {
                clip!.m_CurrentFrame = 0;
                clip!.m_ElapsedTime = 0;    
            }
        }

    }
}
