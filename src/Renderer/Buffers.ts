export enum SHADER_DATA_TYPE
{
    NONE, FLOAT, FLOAT2, FLOAT3, FLOAT4, MAT2, MAT3, MAT4, INT2, INT3, INT4, BOOL,
}
export enum BUFFER_TYPE
{
    VERTEX, UNIFORM
}
export enum BUFFER_USAGE
{
    STATIC, DYNAMIC
}
export function AlignTo16(stride: number): number
{
    return stride + ( (16 - (stride % 16) ) % 16 );
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
    OffsetInBytes: number;
    Padding: number;
    Offset: number; // offset inside the array of data to upload to gpu
    Normalized: boolean;

    constructor(info: {type: SHADER_DATA_TYPE, name: string} ) 
    {
        this.AttributeName = info.name;
        this.Type = info.type;
        this.Size= GetShaderDataTypeSize(info.type);
        this.Normalized = false;
        this.OffsetInBytes = 0;
        this.Offset = 0;
        this.Padding = 0;
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
            case SHADER_DATA_TYPE.MAT3:    return 9;
            case SHADER_DATA_TYPE.MAT4:    return 16;
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
    private m_BufferLayoutElements: BufferElement[];
    private m_Stride: number;
    constructor(elements: {type: SHADER_DATA_TYPE, name: string}[])
    {
        this.m_BufferLayoutElements = elements.map( element => new BufferElement(element))
        this.m_Stride = 0;
        this.CalculateOffsetAndStride();
    }
    public CalculateOffsetAndStride(): void
    {
        this.m_Stride = 0;
        var prevOffsetInBytes = 0;
        var offset = 0; 
        var prevCount = this.m_BufferLayoutElements[0].GetComponentCount();
        this.m_BufferLayoutElements.forEach((element)=>{
            element.OffsetInBytes = prevOffsetInBytes;
            element.Padding = element.GetComponentCount() - prevCount;
            element.Offset = offset // index with padding if needed inside the array of data that will be passed to gpu

            const sizeOfOneComponent = (element.Size / element.GetComponentCount());
            const prevOffset = (prevOffsetInBytes / sizeOfOneComponent);
            
            prevCount = element.GetComponentCount();
            offset = prevOffset + element.GetComponentCount() ; // get the offset in array of uniform buffer data 

            this.m_Stride += element.Size;
            prevOffsetInBytes += element.Size; 
            console.log(`Padding ${element.Padding} element offset ${element.Offset} next offset ${offset}`)
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
