import { RendererAPI } from "./RendererAPI";
import { VertexArray } from "./VertexArray";



export class RenderCommand
{

    private static s_RendererAPI: RendererAPI; 
    
    private constructor(){}
    static Init(rendererAPI: RendererAPI)
    {
        this.s_RendererAPI = rendererAPI;
    }
    
    static ClearColor(): void
    {

    }
    static Clear(): void 
    {

    }

    static DrawIndexed(vertexArray: VertexArray): void
    {

    }
}
