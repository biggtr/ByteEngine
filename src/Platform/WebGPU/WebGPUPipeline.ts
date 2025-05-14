import { Shader } from "@/Renderer/Shader";
import { context } from "@/Core/Byte";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";
import { Geometry } from "@/Renderer/Geometry";
import { RenderPipeline } from "@/Renderer/RenderPipeline";


export class WebGPUPipeline extends RenderPipeline
{

    private m_Device: GPUDevice;
    private m_Pipelines: GPURenderPipeline;
    constructor(geometry: Geometry, shader: Shader)
    {
        super()
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;
        const newPipeline: GPURenderPipeline = this.m_Device.createRenderPipeline({

        })

    }
}
