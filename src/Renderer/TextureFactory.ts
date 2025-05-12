import { WebGlTexture } from "@/Platform/WebGL/WebGLTexture";
import { GraphicsContext } from "./GraphicsContext";
import { RENDERER_API, RendererAPI } from "./RendererAPI";

export class TextureFactory 
{
    
    public static Create(graphicsContext: GraphicsContext)
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGlTexture(graphicsContext.GetContext() as WebGL2RenderingContext);
            // case RENDERER_API.WEBGPU:
            //     return new WebGPUTexture(canvasID);
        }
    }
    
}
