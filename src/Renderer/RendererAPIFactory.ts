import { WebGLRendererAPI } from "@/Platform/WebGL/WebGLRendererAPI";
import { GraphicsContext } from "./GraphicsContext";
import { RENDERER_API, RendererAPI } from "./RendererAPI";

export class RendererAPIFactory
{
    
    public static Create(graphicsContext: GraphicsContext)
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLRendererAPI(graphicsContext);
            // case RENDERER_API.WEBGPU:
            //     return new WebGPURendererAPI();
        }
    }
    
}
