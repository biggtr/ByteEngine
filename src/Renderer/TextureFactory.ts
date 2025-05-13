import { WebGlTexture } from "@/Platform/WebGL/WebGLTexture";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { WebGPUTexture } from "@/Platform/WebGPU/WebGPUTexture";

export class TextureFactory 
{
    
    public static Create(sourceImage: ImageBitmap)
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGlTexture(sourceImage);
            case RENDERER_API.WEBGPU:
                return new WebGPUTexture(sourceImage);
        }
    }
    
}
