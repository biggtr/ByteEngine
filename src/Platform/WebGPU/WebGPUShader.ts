import { context } from "@/Core/Byte";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";
import { Shader, SHADER_SOURCE } from "@/Renderer/Shader";

export class WebGPUShader extends Shader
{
    private m_Device: GPUDevice
    private m_VertexSource: string;
    private m_FragmentSource: string
    private m_ShaderModule: GPUShaderModule;

    constructor(shaderSources: SHADER_SOURCE)
    {
        super()
        this.m_VertexSource = shaderSources.VERTEX;
        this.m_FragmentSource = shaderSources.FRAGMENT;
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;
    }
    public Upload(): void {
        throw new Error("Method not implemented.");
    }

}
