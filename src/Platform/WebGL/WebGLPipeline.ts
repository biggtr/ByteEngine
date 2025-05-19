import { context } from "@/Core/Byte";
import { BindGroup, BindGroupLayout, RESOURCE_TYPE } from "@/Renderer/BindGroup";
import { Geometry } from "@/Renderer/Geometry";
import { RenderPipeline } from "@/Renderer/RenderPipeline";
import { Shader } from "@/Renderer/Shader";
import { Texture } from "@/Renderer/Texture";
import { WebGlBuffer } from "./WebGLBuffers";


export class WebGLPipeline extends RenderPipeline
{
    private m_Webgl: WebGL2RenderingContext;
    private m_BindGroup: BindGroupLayout[];
    private m_Geometry: Geometry;
    private m_Shader: Shader;

    constructor(geometry: Geometry, shader: Shader, bindGroup: BindGroup)
    {
        super()
        const m_Webgl = context.GetContext() as WebGL2RenderingContext;


        this.m_BindGroup = bindGroup.GetBindGroup();
        this.m_Geometry = geometry;
        this.m_Shader = shader;

        this.m_Shader.Upload();
        for(let element of this.m_BindGroup)
        {
            switch(element.ResourceType)
            {
               case RESOURCE_TYPE.BUFFER:
                    const uniformBuffer = element.Data as WebGlBuffer
                    uniformBuffer.Upload()
                    m_Webgl.bindBufferBase(m_Webgl.UNIFORM_BUFFER, element.Binding, uniformBuffer.GetBuffer()); // Bind to binding point 0

                    // Get block index & bind to program
                    const blockIndex = m_Webgl.getUniformBlockIndex(shader.GetModule(), element.Name);
                    m_Webgl.uniformBlockBinding(shader.GetModule(), blockIndex, element.Binding); // Match buffer to shader
                  break;
               case RESOURCE_TYPE.TEXTURE:
               case RESOURCE_TYPE.SAMPLER:
                   const texture = element.Data as Texture
                   texture.Upload(element.Binding);
                   const location = m_Webgl.getUniformLocation(shader.GetModule(), element.Name)
                   m_Webgl.uniform1i(location, element.Binding); // gonna use binding number as a slot for sampler and textures 
               break;
            }
        }
    }

    public GetGeometry(): Geometry 
    {
        return this.m_Geometry;
    }
    public GetShaderModule(): Shader 
    {
        return this.m_Shader;
    }
    public GetRenderPipeline() 
    {

    }
    public GetBindGroup() 
    {
    }
}
