import { WebGLContext } from "@/Platform/WebGL/WebGLContext";
import { WebGPUContext } from "@/Platform/WebGPU/WebGPUContext";
import { RENDERER_API, RendererAPI } from "./RendererAPI";

export class GraphicsContextFactory
{
    
    public static Create(canvasID: string)
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLContext(canvasID);
            case RENDERER_API.WEBGPU:
                return new WebGPUContext(canvasID);
        }
    }
    
}
