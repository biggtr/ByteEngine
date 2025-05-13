export enum SHADER_TYPE
{
    FLOAT, FLOAT2, FLOAT3, FLOAT4, INT, INT2, INT3, INT4
}
export class BufferElement {
    name: string
    type: SHADER_TYPE;
    count: number;
    normalized: boolean;
    offset: number;

    constructor(type: SHADER_TYPE, name: string,  count: number, normalized: boolean = false) {
        this.name = name;
        this.type = type;
        this.count = count;
        this.normalized = normalized;
        this.offset = 0;

    }

    static GetSizeOfType(type: number): number {
        switch (type) {
            case SHADER_TYPE.FLOAT:  return 4;
            case SHADER_TYPE.FLOAT2: return 4 * 2;
            case SHADER_TYPE.FLOAT3: return 4 * 3;
            case SHADER_TYPE.FLOAT4: return 4 * 4;
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
    public UpdateSubData(data: Float32Array, offset: number): void{}
    public abstract Upload(): void;
    public SetLayout(bufferLayout: BufferLayout): void{}
    public GetLayout(): BufferLayout | null{ return null;}
}

export abstract class IndexBuffer
{
    public abstract Upload(): void;
    public abstract GetIndicesCount(): number
}
