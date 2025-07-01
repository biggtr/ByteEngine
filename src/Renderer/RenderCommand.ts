import { Vector4 } from "../Math/Vectors";
import { RendererAPI } from "./RendererAPI";
import { RenderPipeline } from "./RenderPipeline";


export class RenderCommand
{

    private m_RendererAPI: RendererAPI; 
    
    constructor(rendererAPI: RendererAPI)
    {
        this.m_RendererAPI = rendererAPI;
    }
    
    ClearColor(color: Vector4): void
    {
        this.m_RendererAPI.ClearColor(color);
    }

    Clear(): void 
    {
        this.m_RendererAPI.Clear();
    }

    DrawIndexed(pipeline: RenderPipeline): void
    {
        this.m_RendererAPI.DrawIndexed(pipeline);
    }


   
}
