import { WebGLRendererAPI } from "@/Platform/WebGL/WebGLRendererAPI";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { WebGPURendererAPI } from "@/Platform/WebGPU/WebGPURendererAPI";

export class RendererAPIFactory
{
    
    public static Create(): RendererAPI
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLRendererAPI();
            case RENDERER_API.WEBGPU:
                return new WebGPURendererAPI();
        }
    }
    
}
