import { context } from "@/Core/Byte";
import { BufferLayout, IndexBuffer, VertexBuffer } from "@/Renderer/Buffers";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";

export class WebGPUVertexBuffer extends VertexBuffer
{
    private m_Device: GPUDevice;
    private m_Data: Float32Array;
    public m_Buffer: GPUBuffer;
    constructor(data: Float32Array)
    {
        super();
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;
        this.m_Data = data;
        this.m_Buffer = this.m_Device.createBuffer({
                label: "VertexBuffer Created",
                size: data.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            });
    }
    public Upload(): void 
    {
        this.m_Device.queue.writeBuffer(this.m_Buffer, 0, this.m_Data);
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
    public Upload(): void 
    {
        this.m_Device.queue.writeBuffer(this.m_Buffer, 0, this.m_Data);
    }
    
    public GetIndicesCount(): number
    {
        return this.m_Count;
    }
}
