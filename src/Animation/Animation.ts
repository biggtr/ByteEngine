import { Vector2, Vector3 } from "@/Math/Vectors";
import { Texture } from "@/Renderer/Texture";
import { CSprite } from "@/Scene/Components";



export interface Animation
{
    m_Name: string;
    m_Texture: Texture;
    m_TotalFrames: number;
    m_CurrentFrame: number;
    m_FrameWidth: number;
    m_FrameHeight: number;
    m_FrameDuration: number;
    m_IsLooping: boolean;
    m_IsPlaying: boolean;
    m_ElapsedTime: number;
    m_Speed: number;
    m_SheetSize: Vector2
}
export function CreateAnimationClip(name: string, texture: Texture,
                                    totalFrames: number, frameWidth: number,
                                    frameHeight: number, frameDuration: number,
                                    sheetWidth: number, sheetHeight: number,
                                    isLooping: boolean = true, speed: number = 1,): Animation
{
    return {
        m_Name: name,
        m_Texture: texture,
        m_TotalFrames: totalFrames,
        m_CurrentFrame: 0,
        m_FrameWidth: frameWidth,
        m_FrameHeight: frameHeight,
        m_FrameDuration: frameDuration,
        m_IsLooping: isLooping,
        m_IsPlaying: true,
        m_ElapsedTime: 0,
        m_Speed: speed,
        m_SheetSize: new Vector2(sheetWidth, sheetHeight),
    }
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
        sprite.Texture = animation.m_Texture;
        // console.log(sprite.Size);
        // console.log(`animation name: ${animation.m_Name} size: x = ${sprite.Texture.GetSize().x} y = ${sprite.Texture.GetSize().y}`);
        // console.log(`animation name: ${animation.m_Name} spritesize: x = ${sprite.Size.x} y = ${sprite.Size.y}`);
        sprite.UVs = this.GetCurrentUVs(animation, animation.m_SheetSize);
    }
    
    private GetCurrentUVs(animation: Animation, sheetSize : Vector2): Float32Array 
    {
        const column = Math.floor(sheetSize.x / animation.m_FrameWidth);
        const row = Math.floor(sheetSize.y / animation.m_FrameHeight);

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
        return UVs;
    }

}
