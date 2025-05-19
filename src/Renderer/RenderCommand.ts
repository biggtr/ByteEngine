import { Vector4 } from "../Math/Vectors";
import { Geometry } from "./Geometry";
import { RendererAPI } from "./RendererAPI";
import { RenderPipeline } from "./RenderPipeline";


export class RenderCommand
{

    private m_RendererAPI: RendererAPI; 
    
    constructor(rendererAPI: RendererAPI)
    {
        this.m_RendererAPI = rendererAPI;
    }

    public BeginScene(): void
    {
        this.m_RendererAPI.BeginScene();
    }
    
    ClearColor(color: Vector4): void
    {
    }

    Clear(): void 
    {
    }

    DrawIndexed(pipeline: RenderPipeline): void
    {
        this.m_RendererAPI.DrawIndexed(pipeline);
    }

    public EndScene(): void
    {
        this.m_RendererAPI.EndScene()
    }

   
}
