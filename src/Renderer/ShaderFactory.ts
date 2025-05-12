import { WebGlShader } from "@/Platform/WebGL/WebGLShader";
import { GraphicsContext } from "./GraphicsContext";
import { RENDERER_API, RendererAPI } from "./RendererAPI";

export class ShaderFactory 
{
    
    public static Create(graphicsContext: GraphicsContext)
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                return new WebGlShader(graphicsContext.GetContext() as WebGL2RenderingContext);
            // case RENDERER_API.WEBGPU:
            //     return new WebGPUShader(canvasID);
        }
    }
    
}
