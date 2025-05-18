import { context } from "@/Core/Byte";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";
import { Shader  } from "@/Renderer/Shader";

export class WebGPUShader extends Shader
{
    private m_Device: GPUDevice
    private m_ShaderSource: string;
    private m_ShaderModule: GPUShaderModule;

    constructor(source: string)
    {
        super()
        this.m_ShaderSource = source;
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;
        this.m_ShaderModule = this.m_Device.createShaderModule({
            label: "Shader Module",
            code: this.m_ShaderSource
        })
    }
    public Upload(): void 
    {
        throw new Error("Method not implemented.");
    }

    public GetModule(): GPUShaderModule
    {
        return this.m_ShaderModule;
    }
    public GetShaderSources(): string 
    {
        return this.m_ShaderSource;
    }
}
