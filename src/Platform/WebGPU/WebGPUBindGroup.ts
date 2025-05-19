import { context } from "@/Core/Byte";
import { BindGroup, BindGroupLayout, RESOURCE_TYPE, SHADER_TYPE } from "@/Renderer/BindGroup";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";
import { WebGPUBuffer } from "./WebGPUBuffers";
import { WebGPUTexture } from "./WebGPUTexture";

function GetShaderTypeWebGPU(shaderType: SHADER_TYPE): number
{
    let type = 0;

    if (shaderType & SHADER_TYPE.VERTEX)
        type |= GPUShaderStage.VERTEX;

    if (shaderType & SHADER_TYPE.FRAGMENT)
        type |= GPUShaderStage.FRAGMENT;

    if (shaderType & SHADER_TYPE.COMPUTE)
        type |= GPUShaderStage.COMPUTE;

    return type;
}
export class WebGPUBindGroup extends BindGroup
{

    private m_Device: GPUDevice;
    private m_BindGrouplayoutEntries!: BindGroupLayout[];
    private m_BindGroupLayout!: GPUBindGroupLayout;
    private m_BindGroup!: GPUBindGroup;

    constructor()
    {
        super();
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;
        this.m_BindGrouplayoutEntries = [];
    }
    public AddGroupLayout(bindGroupLayout: BindGroupLayout[]): void 
    {
        this.m_BindGrouplayoutEntries = bindGroupLayout;
        
        // extracting bindGrouptLayout to create GPUBindGroupLayoutEntry
        const bindGroupLayoutEntries: GPUBindGroupLayoutEntry[] = []
        const bindGroupEntries: GPUBindGroupEntry[] = []
        for(let entry of this.m_BindGrouplayoutEntries)
        {
           switch(entry.ResourceType)
           {
               case RESOURCE_TYPE.BUFFER:
                   const uniformBuffer = entry.Data as WebGPUBuffer
                   bindGroupLayoutEntries.push({
                        binding: entry.Binding,
                        visibility: GetShaderTypeWebGPU(entry.Visibility),
                        buffer: {}
                   });

                   bindGroupEntries.push({
                       binding: entry.Binding,
                       resource : { buffer: uniformBuffer.GetBuffer() }
                  });
                  break;
               case RESOURCE_TYPE.TEXTURE:
                   const texture = entry.Data as WebGPUTexture

                   bindGroupLayoutEntries.push({
                        binding: entry.Binding,
                        visibility: GetShaderTypeWebGPU(entry.Visibility),
                        texture: {}
                    });

                   bindGroupEntries.push({
                        binding: entry.Binding,
                        resource: texture.m_View
                   });     
                   break;
               case RESOURCE_TYPE.SAMPLER:
                   const textureSampler = entry.Data as WebGPUTexture
                   bindGroupLayoutEntries.push({
                        binding: entry.Binding,
                        visibility: GetShaderTypeWebGPU(entry.Visibility),
                        sampler: {}
                   });

                   bindGroupEntries.push({
                       binding: entry.Binding,
                       resource: textureSampler.m_Sampler
                   });
                   break;
           }
        }
        const newBindGroupLayout = this.m_Device.createBindGroupLayout({
            label:"BindGroupLayout",
            entries: bindGroupLayoutEntries
        })
        this.m_BindGroupLayout = newBindGroupLayout;
        const newBindGroup= this.m_Device.createBindGroup({
            entries: bindGroupEntries,
            layout: newBindGroupLayout,
        })
        this.m_BindGroup = newBindGroup;
        
        //Clear m_BindGrouplayoutEntries for future use 
        this.m_BindGrouplayoutEntries = []
    }
    public GetBindGroupLayout(): GPUBindGroupLayout
    {
        return this.m_BindGroupLayout;
    }
    public GetBindGroup(): GPUBindGroup
    {
        return this.m_BindGroup;
    }

}
