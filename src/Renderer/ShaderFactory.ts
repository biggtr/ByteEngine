import { WebGlShader } from "@/Platform/WebGL/WebGLShader";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { Shader, SHADER_SOURCE } from "./Shader";
import { WebGPUShader } from "@/Platform/WebGPU/WebGPUShader";

export class ShaderFactory 
{
    
    public static Create(source: SHADER_SOURCE | string): Shader
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGlShader(source as SHADER_SOURCE);
            case RENDERER_API.WEBGPU:
                return new WebGPUShader(source as string);
        }
    }
    
}
