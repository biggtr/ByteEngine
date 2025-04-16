import { Vector3, } from "@/Math/Vectors";
import { Sprite } from "@/Renderer/Renderer2D";
import { Texture } from "@/Renderer/Texture";



class Animation
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
        this.m_IsPlaying = false;
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
    public GetCurrentUVs(): number[] 
    {
        const column = this.m_Sprite.Size.x / this.m_FrameWidth;
        const row = this.m_Sprite.Size.y / this.m_FrameHeight;

        const x = this.m_CurrentFrame % column;
        const y = this.m_CurrentFrame / column;

        const u1 = x / column;
        const v1 = y / column;
        const u2 = u1 + (1/column);
        const v2 = v1 + (1/row);
        const UVs = [ u1, v2, u2, v2, u2, v1, u1, v1]
        
        return UVs;

    }

    public Pause(): void
    {
        this.m_IsPlaying = false;
    }



    
}
