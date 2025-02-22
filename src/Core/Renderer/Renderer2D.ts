import { RenderCommand } from "./RenderCommand";
import { Shader } from "./Shader";
import { VertexArray } from "./VertexArray";
import { OrthographicCamera } from "./Cameras";

export class Renderer2D
{
    private m_RenderCommand: RenderCommand; 
    constructor(renderCommand: RenderCommand)
    {
        this.m_RenderCommand = renderCommand;
        
    }

    public BeginScene(camera: OrthographicCamera)
    {

    }

    public EndScene(){}

    public Submit(shader: Shader, vertexArray: VertexArray)
    {

    }
}
