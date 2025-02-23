import { Vector4 } from "../Math/Vectors";
import { RendererAPI } from "./RendererAPI";
import { VertexArray } from "./VertexArray";
import { Shader } from "./Shader";


export class RenderCommand
{

    private m_RendererAPI: RendererAPI; 
    
    constructor(rendererAPI: RendererAPI)
    {
        this.m_RendererAPI = rendererAPI;
    }
    
    ClearColor(color: Vector4): void
    {
        this.m_RendererAPI.ClearColor(color)
    }

    Clear(): void 
    {
        this.m_RendererAPI.Clear();

    }

    DrawIndexed(vertexArray: VertexArray): void
    {
        this.m_RendererAPI.DrawIndexed(vertexArray);
    }

    GetWebGLContext(): WebGL2RenderingContext
    {
        return this.m_RendererAPI.GetWebGLContext();
    }

}
