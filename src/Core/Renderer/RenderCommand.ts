import { Vector4 } from "../Math/Vectors";
import { RendererAPI } from "./RendererAPI";
import { VertexArray } from "./VertexArray";
import { VertexBuffer, IndexBuffer, BufferLayout, BufferElement } from "./Buffers";
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

    CreateQuadVAO(): VertexArray
    {
        var vertices = new Float32Array([
            -0.5,   0.5,   0.0, 1.0, 
            -0.5,  -0.5,   0.0, 0.0, 
             0.5,  -0.5,   1.0, 0.0, 
             0.5,   0.5,   1.0, 1.0, 
        ]);


        var indices = new Uint32Array([
            0, 1, 2,  
            0, 2, 3  
        ]); 

        var vertexBuffer = new VertexBuffer(this.m_RendererAPI.GetWebGLContext());
        var indexBuffer = new IndexBuffer(this.m_RendererAPI.GetWebGLContext());
        var vertexArray = new VertexArray(this.m_RendererAPI.GetWebGLContext());

        vertexBuffer.CreateBuffer(vertices);
        indexBuffer.Create(indices, indices.length);
        var floatType = this.m_RendererAPI.GetWebGLContext().FLOAT;
        const positionElement = new BufferElement(floatType, "position", 2);
        const texCoordsElement = new BufferElement(floatType, "texture",2);
        var bufferLayout = new BufferLayout([positionElement, texCoordsElement]);
        vertexBuffer.SetLayout(bufferLayout);

        vertexArray.SetIndexBuffer(indexBuffer);
        vertexArray.AddVertexBuffer(vertexBuffer);
        
        return vertexArray;
    }
}
