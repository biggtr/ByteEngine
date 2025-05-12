import { RENDERER_API, RendererAPI } from "./RendererAPI";

export class TextureFactory 
{
    
    public static Create(canvasID: string)
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLTexture();
            case RENDERER_API.WEBGPU:
                return new WebGPUTexture(canvasID);
        }
    }
    
}
