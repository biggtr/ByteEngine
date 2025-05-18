import { WebGLIndexBuffer, WebGlBuffer as WebGLBuffer } from "@/Platform/WebGL/WebGLBuffers";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { WebGPUIndexBuffer, WebGPUBuffer} from "@/Platform/WebGPU/WebGPUBuffers";
import { BUFFER_TYPE, IndexBuffer, Buffer } from "./Buffers";
export class BufferFactory
{
    public static Create(data: Float32Array, bufferType: BUFFER_TYPE): Buffer
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLBuffer(data, bufferType);
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
