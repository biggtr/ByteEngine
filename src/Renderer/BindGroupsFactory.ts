import { WebGPUBindGroups } from "@/Platform/WebGPU/WebGPUBindGroups";
import { BindGroups } from "./BindGroups";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { WebGLBindGroups } from "@/Platform/WebGL/WebGLBindGroups";


export class BindGroupsFactory
{
    static Create(): BindGroups
    {

        switch (RendererAPI.s_API) 
        {
            case RENDERER_API.WEBGL:
                return new WebGLBindGroups();
            case RENDERER_API.WEBGPU:
                return new WebGPUBindGroups();
        }
    }
}
