import { Buffer, IndexBuffer } from "@/Renderer/Buffers";
import { Geometry } from "@/Renderer/Geometry";


export class WebGPUGeometry extends Geometry
{

    private m_VertexBuffers: Array<Buffer> = [];
    private m_IndexBuffer!: IndexBuffer;
    constructor()
    {
        super();
    }
    public AddVertexBuffer(vertexBuffer: Buffer): void 
    {
        this.m_VertexBuffers.push(vertexBuffer);
    }
    public GetVertexBuffers(): Buffer[] 
    {
        return this.m_VertexBuffers;
    }
    public SetIndexBuffer(indexBuffer: IndexBuffer): void 
    {
        this.m_IndexBuffer = indexBuffer;
    }
    public GetIndexBuffer(): IndexBuffer  
    {
        return this.m_IndexBuffer;
    }

}
