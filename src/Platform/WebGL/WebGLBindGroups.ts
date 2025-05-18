import { context } from "@/Core/Byte";
import { BindGroupLayout, BindGroups, RESOURCE_TYPE, SHADER_TYPE } from "@/Renderer/BindGroups";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";

function GetShaderTypeWebGL(shaderType: SHADER_TYPE): number
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
export class WebGLBindGroups extends BindGroups
{

    private m_Webgl: WebGL2RenderingContext
    private m_BindGrouplayoutEntries!: BindGroupLayout[];
    private m_NumberOfGroups: number;

    constructor()
    {
        super();
        this.m_Webgl= context.GetContext() as WebGL2RenderingContext;
        this.m_NumberOfGroups = 0;
    }
    public AddGroupLayout(bindGroupLayout: BindGroupLayout[]): void 
    {
        this.m_BindGrouplayoutEntries = bindGroupLayout;
        
        for(let entry of this.m_BindGrouplayoutEntries)
        {
           switch(entry.ResourceType)
           {
               case RESOURCE_TYPE.BUFFER:

                  //  bindGroupLayoutEntries.push({
                  //       binding: entry.Binding,
                  //       visibility: GetShaderTypeWebGPU(entry.Visibility),
                  //       buffer: {}
                  //  });
                  //
                  //  bindGroupEntries.push({
                  //      binding: entry.Binding,
                  //      resource : { buffer: entry.Data as GPUBuffer}
                  // });
                  // break;
               case RESOURCE_TYPE.TEXTURE:

                   break;
               case RESOURCE_TYPE.SAMPLER:
                   break;
           }
        }
        
        //Clear m_BindGrouplayoutEntries for future use 
        this.m_BindGrouplayoutEntries = []
    }
    public GetBindGroupLayouts(): BindGroupLayout[]
    {
        return this.m_BindGrouplayoutEntries;
    }

}

