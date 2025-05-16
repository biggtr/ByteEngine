import { RENDERER_API, RendererAPI } from "@/Renderer/RendererAPI";
import { ResourceHandler } from "./ResourceHandlers";
import { WebGLShaderHandler, WebGLTextureHandler } from "@/Platform/WebGL/ResourceManagement/WebGLResourceHanderls";
import { WebGPUShaderHandler, WebGPUTextureHandler } from "@/Platform/WebGPU/ResourceManagement/WebGPUResourceHanderls";
export enum HANDLER_TYPE
{
    SHADER, TEXTURE
}
export class ResourceManager
{
    private m_ResourceHandlers: Map<HANDLER_TYPE, ResourceHandler<any>> = new Map();

    public Init(): void
    {
        switch(RendererAPI.s_API)
        {
            case RENDERER_API.WEBGL:
                {
                    const textureHandler = new WebGLTextureHandler();
                    const shaderHandler = new WebGLShaderHandler();
                    this.m_ResourceHandlers.set(HANDLER_TYPE.SHADER, shaderHandler);
                    this.m_ResourceHandlers.set(HANDLER_TYPE.TEXTURE, textureHandler);
                }
            case RENDERER_API.WEBGPU:
                {
                    const textureHandler = new WebGPUTextureHandler();
                    const shaderHandler = new WebGPUShaderHandler();
                    this.m_ResourceHandlers.set(HANDLER_TYPE.SHADER, shaderHandler);
                    this.m_ResourceHandlers.set(HANDLER_TYPE.TEXTURE, textureHandler);
                }
        }
    }
    
    public GetHandler(handlerType: HANDLER_TYPE): ResourceHandler<any>
    {
        return this.m_ResourceHandlers.get(handlerType) as ResourceHandler<any>;
    }

}
