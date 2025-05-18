import { Vector4 } from "../Math/Vectors";
import { Geometry } from "./Geometry";
import { RendererAPI } from "./RendererAPI";


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

    DrawIndexed(geometry: Geometry): void
    {
        this.m_RendererAPI.DrawIndexed(geometry);
    }

   
}
