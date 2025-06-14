import { CSprite } from "@/Scene/Components";



export interface Animation
{
    m_Name: string;
    m_TotalFrames: number;
    m_CurrentFrame: number;
    m_FrameWidth: number;
    m_FrameHeight: number;
    m_FrameDuration: number;
    m_IsLooping: boolean;
    m_IsPlaying: boolean;
    m_ElapsedTime: number;
    Speed: number;
}

export class AnimationManager
{


    public Update(animation: Animation, sprite: CSprite, deltaTime: number): void
    {
        if(!animation.m_IsPlaying)
        {
            return;
        }
        animation.m_ElapsedTime += deltaTime;
        this.GetCurrentUVs(animation, sprite);
        if(animation.m_ElapsedTime >= animation.m_FrameDuration)
        {
            animation.m_CurrentFrame++;
            animation.m_ElapsedTime = 0;

            if(animation.m_CurrentFrame == animation.m_TotalFrames)
            {
                if(animation.m_IsLooping)
                {
                    animation.m_CurrentFrame = 0;
                }
                else
                {
                    animation.m_CurrentFrame = animation.m_TotalFrames - 1;
                    animation.m_IsPlaying = false; // pause the animation
                }
            }
        }
    }
    
    private GetCurrentUVs(animation: Animation, sprite: CSprite): void
    {
        const column = Math.floor(sprite.Size.x / animation.m_FrameWidth);
        const row = Math.floor(sprite.Size.y / animation.m_FrameHeight);

        const x = animation.m_CurrentFrame % column;
        const y = Math.floor(animation.m_CurrentFrame / column);

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
        sprite.UVs = UVs;
    }

}
