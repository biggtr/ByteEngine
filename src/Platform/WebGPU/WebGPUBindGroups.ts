import { context } from "@/Core/Byte";
import { BindGroups, BindGroupLayout, SHADER_TYPE, RESOURCE_TYPE } from "@/Renderer/BindGroups";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";

function GetShaderTypeWebGPU(shaderType: SHADER_TYPE): number
{
    switch (shaderType) 
    {
        case SHADER_TYPE.VERTEX:
            return GPUShaderStage.VERTEX
        case SHADER_TYPE.FRAGMENT:
            return GPUShaderStage.FRAGMENT
        case SHADER_TYPE.COMPUTE:
            return GPUShaderStage.COMPUTE
    }
}
export class WebGPUBindGroups extends BindGroups
{

    private m_Device: GPUDevice;
    private m_BindGrouplayoutEntries!: BindGroupLayout[];
    private m_BindGroupLayouts!: GPUBindGroupLayout[];
    private m_BindGroups!: GPUBindGroup[];
    private m_NumberOfGroups: number;

    constructor()
    {
        super();
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;
        this.m_NumberOfGroups = 0;
        this.m_BindGroups = [];
        this.m_BindGroupLayouts = [];
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

                   bindGroupLayoutEntries.push({
                        binding: entry.Binding,
                        visibility: GetShaderTypeWebGPU(entry.Visibility),
                        buffer: {}
                   });

                   bindGroupEntries.push({
                       binding: entry.Binding,
                       resource : entry.Data as GPUBufferBinding
                  });
                  break;
               case RESOURCE_TYPE.TEXTURE:

                   bindGroupLayoutEntries.push({
                        binding: entry.Binding,
                        visibility: GetShaderTypeWebGPU(entry.Visibility),
                        texture: {}
                    });

                   bindGroupEntries.push({
                        binding: entry.Binding,
                        resource: entry.Data as GPUTextureView
                   });     
                   break;
               case RESOURCE_TYPE.SAMPLER:
                   bindGroupLayoutEntries.push({
                        binding: entry.Binding,
                        visibility: GetShaderTypeWebGPU(entry.Visibility),
                        sampler: {}
                   });

                   bindGroupEntries.push({
                       binding: entry.Binding,
                       resource: entry.Data as GPUSampler
                   });
                   break;
           }
        }
        const newBindGroupLayout = this.m_Device.createBindGroupLayout({
            label:"BindGroupLayout",
            entries: bindGroupLayoutEntries
        })
        this.m_BindGroupLayouts.push(newBindGroupLayout);
        const newBindGroup= this.m_Device.createBindGroup({
            entries: bindGroupEntries,
            layout: newBindGroupLayout,
        })
        this.m_BindGroups.push(newBindGroup);
        
        //Clear m_BindGrouplayoutEntries for future use 
        this.m_BindGrouplayoutEntries = []
    }
    public GetBindGroupLayouts(): GPUBindGroupLayout[]
    {
        return this.m_BindGroupLayouts;
    }
    public GetBindGroup(index: number): GPUBindGroup
    {
        if(index > this.m_NumberOfGroups)
        {
            throw Error("Index Out Of Bounds..");
        }
        return this.m_BindGroups[index];;
        
    }

}
