import { context } from "@/Core/Byte";
import { AlignTo16, BUFFER_TYPE, BufferLayout, IndexBuffer, SHADER_DATA_TYPE, Buffer } from "@/Renderer/Buffers";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";

function GetShaderTypeWebGPU(shaderType: SHADER_DATA_TYPE): GPUVertexFormat | null
{

    switch (shaderType) 
    {
        case SHADER_DATA_TYPE.FLOAT:   return "float32";
        case SHADER_DATA_TYPE.FLOAT2:  return "float32x2";
        case SHADER_DATA_TYPE.FLOAT3:  return "float32x3";
        case SHADER_DATA_TYPE.FLOAT4:  return "float32x4";
        default: return null
    }

}
export class WebGPUBuffer extends Buffer
{
    private m_Device: GPUDevice;
    private m_Data: Float32Array;
    private m_Layout!: GPUVertexBufferLayout;
    private m_BufferLayout!: BufferLayout;
    private m_BufferType: BUFFER_TYPE;
    public m_Buffer!: GPUBuffer;
    
    constructor(data: Float32Array, bufferType: BUFFER_TYPE)
    {
        super();
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;
        this.m_Data = data;
        this.m_BufferType = bufferType;
    }
    public GetBuffer(): GPUBuffer 
    {
       return this.m_Buffer; 
    }
    public Upload(): void 
    {
        switch(this.m_BufferType)
        {
            case BUFFER_TYPE.VERTEX:
            this.m_Buffer = this.m_Device.createBuffer({
                    label: "VertexBuffer Created",
                    size: this.m_Data.byteLength,
                    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
                });
                break;
            case BUFFER_TYPE.UNIFORM:
            this.m_Buffer = this.m_Device.createBuffer({
                    label: "UniformBuffer Created",
                    size: AlignTo16(this.m_BufferLayout.GetStride()),
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
                });
                break;

        }
        this.m_Device.queue.writeBuffer(this.m_Buffer, 0, this.m_Data);
    }
    
    public SetLayout(bufferLayout: BufferLayout): void 
    {
        this.m_BufferLayout = bufferLayout;
        const bufferElements = bufferLayout.m_BufferLayoutElements;
        const attributes: GPUVertexAttribute[] = [];
        for(let location = 0; location < bufferElements.length; location++)
        {
            const element = bufferElements[location];
            const format = GetShaderTypeWebGPU(element.Type)
            if(!format)
            {
                continue;
            }
            attributes.push({
                format: format,
                offset: element.OffsetInBytes,
                shaderLocation: location,
            })
        }
        this.m_Layout = {
            arrayStride: bufferLayout.GetStride(),
            attributes: attributes,
        }

    }
    public GetLayout(): GPUVertexBufferLayout 
    {
        return this.m_Layout;
    }
}
export class WebGPUIndexBuffer extends IndexBuffer
{
    private m_Device: GPUDevice;
    private m_Data: Uint32Array;
    public m_Buffer: GPUBuffer;
    public m_Count: number;
    constructor(indices: Uint32Array, count: number)
    {
        super();
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;
        this.m_Data = indices;
        this.m_Count = count;
        this.m_Buffer = this.m_Device.createBuffer({
                label: "IndexBuffer Created",
                size: this.m_Data.byteLength,
                usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
            });
    }
    public GetBuffer(): GPUBuffer 
    {
        return this.m_Buffer;     
    }
    public Upload(): void 
    {
        this.m_Device.queue.writeBuffer(this.m_Buffer, 0, this.m_Data);
    }
    
    public GetIndicesCount(): number
    {
        return this.m_Count;
    }
}
