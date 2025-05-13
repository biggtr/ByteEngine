import { SHADER_SOURCE, WebGlShader } from "@/Platform/WebGL/WebGLShader";
import { RENDERER_API, RendererAPI } from "./RendererAPI";

export class ShaderFactory 
{
    
    public static Create(shaderSources: SHADER_SOURCE)
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGlShader(shaderSources);
            // case RENDERER_API.WEBGPU:
            //     return new WebGPUShader(canvasID);
        }
    }
    
}
