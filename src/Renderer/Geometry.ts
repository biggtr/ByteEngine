import { IndexBuffer, Buffer } from "./Buffers";


export abstract class Geometry
{
    public Upload(): void{}
    public abstract AddVertexBuffer(vertexBuffer: Buffer): void;
    public abstract GetVertexBuffers(): Buffer[];
    public abstract SetIndexBuffer(indexBuffer: IndexBuffer): void;
    public abstract GetIndexBuffer(): IndexBuffer 
}
