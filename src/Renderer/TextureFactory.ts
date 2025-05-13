import { WebGlTexture } from "@/Platform/WebGL/WebGLTexture";
import { RENDERER_API, RendererAPI } from "./RendererAPI";

export class TextureFactory 
{
    
    public static Create()
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGlTexture();
            // case RENDERER_API.WEBGPU:
            //     return new WebGPUTexture(canvasID);
        }
    }
    
}
