import { WebGLIndexBuffer, WebGLVertexBuffer } from "@/Platform/WebGL/WebGLBuffers";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { WebGPUIndexBuffer, WebGPUVertexBuffer } from "@/Platform/WebGPU/WebGPUBuffers";
import { IndexBuffer, VertexBuffer } from "./Buffers";
export class VertexBufferFactory
{
    public static Create(data: Float32Array): VertexBuffer
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLVertexBuffer(data);
            case RENDERER_API.WEBGPU:
                return new WebGPUVertexBuffer(data);
        }
    }
    
}

export class IndexBufferFactory 
{
    
    public static Create(indices: Uint32Array, count: number): IndexBuffer 
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLIndexBuffer(indices, count);
            case RENDERER_API.WEBGPU:
                return new WebGPUIndexBuffer(indices, count);
        }
    }
    
}
