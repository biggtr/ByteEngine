
export class BufferElement {
    name: string
    type: number;
    count: number;
    normalized: boolean;
    offset: number;

    constructor(type: number, name: string,  count: number, normalized: boolean = false) {
        this.name = name;
        this.type = type;
        this.count = count;
        this.normalized = normalized;
        this.offset = 0;

    }

    static GetSizeOfType(type: number): number {
        switch (type) {
            case WebGL2RenderingContext.FLOAT: return 4;
            case WebGL2RenderingContext.UNSIGNED_INT: return 4;
            case WebGL2RenderingContext.UNSIGNED_BYTE: return 1;
            default: throw new Error("Unknown type!");
        }
    }

}
export class BufferLayout
{
    private m_BufferLayoutElements: Array<BufferElement>;
    private m_Stride: number;
    constructor(bufferLayoutElements: Array<BufferElement>)
    {
        this.m_BufferLayoutElements = bufferLayoutElements;
        this.m_Stride = 0;
        this.CalculateOffsetAndStride();
    }
    public CalculateOffsetAndStride(): void
    {
        this.m_Stride = 0;
        var offset = 0;
        
        this.m_BufferLayoutElements.forEach((element)=>{
            
            element.offset = offset;
            this.m_Stride += element.count * BufferElement.GetSizeOfType(element.type);
            offset += element.count * BufferElement.GetSizeOfType(element.type);

        })
    }
    public GetBufferElements(): Array<BufferElement>
    {
        return this.m_BufferLayoutElements;
    }

    public GetStride(): number
    {
        return this.m_Stride;
    }
 
}

export abstract class VertexBuffer
{
    public abstract Bind(): void
    public abstract Init(data: Float32Array): void 
    public abstract UpdateSubData(data: Float32Array, offset: number): void
    public abstract SetLayout(bufferLayout: BufferLayout): void
    public abstract GetLayout(): BufferLayout | null
}

export abstract class IndexBuffer
{


    public abstract Bind(): void 
    public abstract Init(indices: Uint32Array, count: number): void
    public abstract GetIndicesCount(): number

}
