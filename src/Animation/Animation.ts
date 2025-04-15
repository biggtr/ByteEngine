import { Vector3, } from "@/Math/Vectors";
import { Sprite } from "@/Renderer/Renderer2D";
import { Texture } from "@/Renderer/Texture";



class Animation
{
    private m_Name: string;
    private m_FrameCount: number;
    private m_AnimationDuration: number;
    private m_SpriteSize: Vector3;
    private m_Sprite: Sprite;
    constructor(animationName: string, frameCount: number, animDuration: number, spriteSize: Vector3, sprite: Sprite)
    {
        this.m_Name = animationName;
        this.m_FrameCount = frameCount;
        this.m_AnimationDuration = animDuration;
        this.m_SpriteSize = spriteSize;
        this.m_Sprite = sprite;
    }

    public Update()
    {

    }

    public GetSize(): Vector3 
    {
        return this.m_SpriteSize;
    }


    
}
