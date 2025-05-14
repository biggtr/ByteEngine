import { IndexBuffer, VertexBuffer } from "./Buffers";


export abstract class Geometry
{
    public Upload(): void{}
    public abstract AddVertexBuffer(vertexBuffer: VertexBuffer): void;
    public abstract GetVertexBuffers(): VertexBuffer[];
    public abstract SetIndexBuffer(indexBuffer: IndexBuffer): void;
    public abstract GetIndexBuffer(): IndexBuffer 
}
