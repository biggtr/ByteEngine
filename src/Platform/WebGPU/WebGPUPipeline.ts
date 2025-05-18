import { Shader } from "@/Renderer/Shader";
import { context } from "@/Core/Byte";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";
import { Geometry } from "@/Renderer/Geometry";
import { RenderPipeline } from "@/Renderer/RenderPipeline";
import { BindGroup } from "@/Renderer/BindGroup";


export class WebGPUPipeline extends RenderPipeline
{

    private m_Device: GPUDevice;
    private m_PipelineLayout: GPUPipelineLayout;
    private m_Pipeline: GPURenderPipeline;
    private m_BindGroup: BindGroup
    constructor(geometry: Geometry, shader: Shader, bindGroup: BindGroup)
    {
        super()
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;
        this.m_BindGroup = bindGroup;
        this.m_PipelineLayout = this.m_Device.createPipelineLayout({
            label: "Pipeline Layout",
            bindGroupLayouts: [ bindGroup.GetBindGroupLayout()]
        })
        this.m_Pipeline = this.m_Device.createRenderPipeline({
            label: "Pipeline",
            layout: this.m_PipelineLayout,
            vertex:{
                entryPoint: "vertexMain",
                module: shader.GetModule(),
                buffers: [geometry.GetVertexBuffers()[0].GetLayout()]
            },
            fragment:{
                entryPoint: "fragmentMain",
                module: shader.GetModule(),
                targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }]
            }

        })

    }
    public GetRenderPipeline(): GPURenderPipeline
    {
        return this.m_Pipeline;
    }
        
    public GetBindGroup(): GPUBindGroup
    {
        return this.m_BindGroup.GetBindGroup();
    }
}
