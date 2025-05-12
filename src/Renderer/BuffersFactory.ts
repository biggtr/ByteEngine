import { WebGLIndexBuffer, WebGLVertexBuffer } from "@/Platform/WebGL/WebGLBuffers";
import { RENDERER_API, RendererAPI } from "./RendererAPI";
import { GraphicsContext } from "./GraphicsContext";
// import { WebGPUContext } from "@/Platform/WebGPU/WebGPUContext";
export class VertexBufferFactory
{
    public static Create(graphicsContext: GraphicsContext)
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLVertexBuffer(graphicsContext.GetContext() as WebGL2RenderingContext);
            // case RENDERER_API.WEBGPU:
            //     return new WebGPUVertexBuffer(GraphicsContext.GetContext() as WebGPUContext);
        }
    }
    
}

export class IndexBufferFactory 
{
    
    public static Create(graphicsContext: GraphicsContext)
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGLIndexBuffer(graphicsContext.GetContext() as WebGL2RenderingContext);
            // case RENDERER_API.WEBGPU:
            //     return new WebGPUIndexBuffer(canvasID);
        }
    }
    
}
