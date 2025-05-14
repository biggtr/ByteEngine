export enum SHADER_DATA_TYPE
{
    NONE, FLOAT, FLOAT2, FLOAT3, FLOAT4, MAT2, MAT3, MAT4, INT2, INT3, INT4, BOOL,
}
export function GetShaderDataTypeSize(type: SHADER_DATA_TYPE): number 
{
    switch (type)
    {
        case SHADER_DATA_TYPE.FLOAT:   return 4 * 1;
        case SHADER_DATA_TYPE.FLOAT2:  return 4 * 2;
        case SHADER_DATA_TYPE.FLOAT3:  return 4 * 3;
        case SHADER_DATA_TYPE.FLOAT4:  return 4 * 4;
        case SHADER_DATA_TYPE.MAT2:    return 4 * 4;
        case SHADER_DATA_TYPE.MAT3:    return 4 * 3 * 3;
        case SHADER_DATA_TYPE.MAT4:    return 4 * 4 * 4;
        case SHADER_DATA_TYPE.INT2:    return 4 * 2;
        case SHADER_DATA_TYPE.INT3:    return 4 * 3;
        case SHADER_DATA_TYPE.INT4:    return 4 * 4;
        case SHADER_DATA_TYPE.BOOL:    return 1;
        case SHADER_DATA_TYPE.NONE:    return 0;
        default: throw new Error("Unknown type!");
    }
}
export class BufferElement 
{
    AttributeName: string
    Type: SHADER_DATA_TYPE;
    Size: number;
    Offset: number;
    Normalized: boolean;

    constructor(type: SHADER_DATA_TYPE, name: string, normalized: boolean = false) 
    {
        this.AttributeName = name;
        this.Type = type;
        this.Size= GetShaderDataTypeSize(type);
        this.Normalized = normalized;
        this.Offset = 0;
    }
    public GetComponentCount(): number 
    {
        switch (this.Type)
        {
            case SHADER_DATA_TYPE.FLOAT:   return 1;
            case SHADER_DATA_TYPE.FLOAT2:  return 2;
            case SHADER_DATA_TYPE.FLOAT3:  return 3;
            case SHADER_DATA_TYPE.FLOAT4:  return 4;
            case SHADER_DATA_TYPE.MAT2:    return 4;
            case SHADER_DATA_TYPE.MAT3:    return 3;
            case SHADER_DATA_TYPE.MAT4:    return 4;
            case SHADER_DATA_TYPE.INT2:    return 2;
            case SHADER_DATA_TYPE.INT3:    return 3;
            case SHADER_DATA_TYPE.INT4:    return 4;
            case SHADER_DATA_TYPE.BOOL:    return 1;
            case SHADER_DATA_TYPE.NONE:    return 0;
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
            
            element.Offset = offset;
            this.m_Stride += element.Size;
            offset += element.Size; 

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
    public abstract GetBuffer(): any
    public UpdateSubData(data: Float32Array, offset: number): void{}
    public abstract Upload(): void;
    public abstract SetLayout(bufferLayout: BufferLayout): void
    public abstract GetLayout(): any;
}
export abstract class IndexBuffer
{
    public abstract GetBuffer(): any
    public abstract Upload(): void;
    public abstract GetIndicesCount(): number
}
