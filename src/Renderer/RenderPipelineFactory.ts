import { WebGPUPipeline } from "@/Platform/WebGPU/WebGPUPipeline";
import { Geometry } from "./Geometry";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { Shader } from "./Shader";
import { RenderPipeline } from "./RenderPipeline";
import { WebGLPipeline } from "@/Platform/WebGL/WebGLPipeline";


export class RenderPipelineFactory
{
    public static Create(geometry: Geometry, shader: Shader): RenderPipeline
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLPipeline();
            case RENDERER_API.WEBGPU:
                return new WebGPUPipeline(geometry, shader);
        }

    }
}
