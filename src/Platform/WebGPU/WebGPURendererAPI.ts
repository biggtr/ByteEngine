import { context } from "@/Core/Byte";
import { Vector4 } from "@/Math/Vectors";
import { Geometry } from "@/Renderer/Geometry";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";
import { RendererAPI } from "@/Renderer/RendererAPI";
import { RenderPipeline } from "@/Renderer/RenderPipeline";

export class WebGPURendererAPI extends RendererAPI
{
    private m_WebgpuContext: WebGPUContextData
    private m_Device: GPUDevice;

    private m_CommandEncoder!: GPUCommandEncoder;
    private m_RenderPass!: GPURenderPassEncoder;
    constructor()
    {
        super();
        this.m_WebgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = this.m_WebgpuContext.Device;
    }
    public BeginScene()
    {
        const swapChainTexture = this.m_WebgpuContext.Context.getCurrentTexture();
        this.m_CommandEncoder = this.m_Device.createCommandEncoder();

        this.m_RenderPass = this.m_CommandEncoder.beginRenderPass({
            label: "RenderPass",
            colorAttachments: [{
            view: swapChainTexture.createView(),
            loadOp: 'clear',  
            clearValue: [1.0, 1.0, 1.0, 1.0],
            storeOp: 'store', 
            }]
        })

    }
    public DrawIndexed(pipeline: RenderPipeline): void 
    {
        const geometry = pipeline.GetGeometry()
        const firstBuffer = geometry.GetVertexBuffers()[0];
        const firstIndexBuffer = geometry.GetIndexBuffer();
        this.m_RenderPass.setPipeline(pipeline.GetRenderPipeline());
        this.m_RenderPass.setVertexBuffer(0, firstBuffer.GetBuffer());
        this.m_RenderPass.setIndexBuffer(firstIndexBuffer.GetBuffer(), "uint32");
        this.m_RenderPass.setBindGroup(0, pipeline.GetBindGroup())
        this.m_RenderPass.drawIndexed(firstIndexBuffer.GetIndicesCount());
    }
    public EndScene() // batching all drawcalls coming from drawIndexed and then ending the scene by submitting them
    {
        this.m_RenderPass.end();
        const commandBuffer = this.m_CommandEncoder.finish();
        this.m_Device.queue.submit([commandBuffer]);
    }

}
