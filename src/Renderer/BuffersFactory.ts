import { WebGLIndexBuffer, WebGLVertexBuffer as WebGLBuffer } from "@/Platform/WebGL/WebGLBuffers";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { WebGPUIndexBuffer, WebGPUVertexBuffer as WebGPUBuffer } from "@/Platform/WebGPU/WebGPUBuffers";
import { BUFFER_TYPE, IndexBuffer, VertexBuffer } from "./Buffers";
export class BufferFactory
{
    public static Create(data: Float32Array, bufferType: BUFFER_TYPE): VertexBuffer
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLBuffer(data);
            case RENDERER_API.WEBGPU:
                return new WebGPUBuffer(data, bufferType);
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
