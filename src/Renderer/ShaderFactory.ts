import { RENDERER_API, RendererAPI } from "./RendererAPI";

export class ShaderFactory 
{
    
    public static Create(canvasID: string)
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLShader(canvasID);
            case RENDERER_API.WEBGPU:
                return new WebGPUShader(canvasID);
        }
    }
    
}
