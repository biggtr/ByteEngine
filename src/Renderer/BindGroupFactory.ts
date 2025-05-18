import { WebGPUBindGroup } from "@/Platform/WebGPU/WebGPUBindGroup";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { BindGroup } from "./BindGroup";
import { WebGLBindGroup } from "@/Platform/WebGL/WebGLBindGroup";


export class BindGroupFactory
{
    static Create(): BindGroup
    {

        switch (RendererAPI.s_API) 
        {
            case RENDERER_API.WEBGL:
                return new WebGLBindGroup();
            case RENDERER_API.WEBGPU:
                return new WebGPUBindGroup();
        }
    }
}
