import { WebGLGeometry } from "@/Platform/WebGL/WebGLGeometry";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { WebGPUGeometry } from "@/Platform/WebGPU/WebGPUGeometry";
import { Geometry } from "./Geometry";

export class GeometryFactory
{
    
    public static Create(): Geometry
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLGeometry();
            case RENDERER_API.WEBGPU:
                return new WebGPUGeometry();
        }
    }
    
}
