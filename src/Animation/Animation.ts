import { Vector3, } from "@/Math/Vectors";
import { Sprite } from "@/Renderer/Renderer2D";
import { Texture } from "@/Renderer/Texture";



export class Animation
{
    private m_Name: string;
    private m_TotalFrames: number;
    private m_CurrentFrame: number;
    private m_FrameWidth: number;
    private m_FrameHeight: number;
    private m_FrameDuration: number;
    private m_IsLooping: boolean;
    private m_IsPlaying: boolean;
    private m_ElapsedTime: number;
    private m_Sprite: Sprite;
    constructor(animationName: string, 
                totalFrames: number,
                frameDuration: number,
                frameWidth: number,
                frameHeight: number,
                sprite: Sprite,
               )


    {
        this.m_Name = animationName;
        this.m_TotalFrames = totalFrames;
        this.m_CurrentFrame = 0;
        this.m_FrameWidth = frameWidth;
        this.m_FrameHeight = frameHeight;
        this.m_FrameDuration = frameDuration;
        this.m_IsLooping = true;
        this.m_IsPlaying = true;
        this.m_ElapsedTime = 0;
        this.m_Sprite = sprite;
    }

    public Update(deltaTime: number): void
    {
        if(!this.m_IsPlaying)
        {
            return;
        }
        this.m_ElapsedTime += deltaTime;
        if(this.m_ElapsedTime >= this.m_FrameDuration)
        {
            this.m_CurrentFrame++;
            this.m_ElapsedTime = 0;

            if(this.m_CurrentFrame == this.m_TotalFrames)
            {
                if(this.m_IsLooping)
                {
                    this.m_CurrentFrame = 0;
                }
                else
                {
                    this.m_CurrentFrame = this.m_TotalFrames - 1;
                    this.Pause();
                }
            }
        }
            

    }
    public GetSprite(): Sprite
    {
        return this.m_Sprite;
    }
    public GetCurrentUVs(): void
    {
        const column = Math.floor(this.m_Sprite.Size.x / this.m_FrameWidth);
        const row = Math.floor(this.m_Sprite.Size.y / this.m_FrameHeight);

        const x = this.m_CurrentFrame % column;
        const y = Math.floor(this.m_CurrentFrame / column);

        //count for the flipped texture behaviour of opengl
        // const adjustedY = row - 1 - y;

        // console.log(this.m_CurrentFrame);
        //normalize uv coords to use them directly by my rendering system
        const u1 = x / column; // u 
        const v1 = y / row; // v 
        const u2 = u1 + (1/column); // u + width of one frame
        const v2 = v1 + (1/row); // v + height of one frame
        const UVs = new Float32Array([ 
            u1, v1, // bot left
            u2, v1, // bot right 
            u2, v2, // top right
            u1, v2 // top left
        ]);
        
        // console.log(UVs)
        this.m_Sprite.UVs = UVs;

    }

    public Pause(): void
    {
        this.m_IsPlaying = false;
    }



    
}
