
export abstract class WebGPUVertexBuffer
{
    private m_Device: GPUDevice;
    constructor(device: GPUDevice)
    {
        this.m_Device = device;
    }
    public Init(data: Float32Array): void 
    {
        const vertexBuffer = this.m_Device.createBuffer({
                label: "VertexBuffer Created",
                size: data.byteLength,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
            });
        this.m_Device.queue.writeBuffer(vertexBuffer, 0, data);
    }
    
}
