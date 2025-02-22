import { RendererAPI } from "./RendererAPI";
import { VertexArray } from "./VertexArray";



export class RenderCommand
{

    private m_RendererAPI: RendererAPI; 
    
    constructor(rendererAPI: RendererAPI)
    {
        this.m_RendererAPI = rendererAPI;
    }
    
    ClearColor(): void
    {

    }
    Clear(): void 
    {

    }

    DrawIndexed(vertexArray: VertexArray): void
    {

    }
}
