import { WebGLRendererAPI } from "@/Platform/WebGL/WebGLRendererAPI";
import { RENDERER_API, RendererAPI } from "./RendererAPI";

export class RendererAPIFactory
{
    
    public static Create()
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLRendererAPI();
            // case RENDERER_API.WEBGPU:
            //     return new WebGPURendererAPI();
        }
    }
    
}
