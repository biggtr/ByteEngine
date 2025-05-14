import { VertexBuffer, IndexBuffer } from "@/Renderer/Buffers";
import { Geometry } from "@/Renderer/Geometry";


export class WebGPUGeometry extends Geometry
{

    private m_VertexBuffers: Array<VertexBuffer> = [];
    private m_IndexBuffer: IndexBuffer | null = null;
    constructor()
    {
        super();
    }
    public AddVertexBuffer(vertexBuffer: VertexBuffer): void 
    {
        this.m_VertexBuffers.push(vertexBuffer);
    }
    public GetVertexBuffers(): VertexBuffer[] 
    {
        return this.m_VertexBuffers;
    }
    public SetIndexBuffer(indexBuffer: IndexBuffer): void 
    {
        this.m_IndexBuffer = indexBuffer;
    }
    public GetIndexBuffer(): IndexBuffer | null 
    {
        return this.m_IndexBuffer;
    }

}
