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

    constructor(geometry: Geometry, shader: Shader, bindGroup: BindGroup)
    {
        super()
        const m_Webgl = context.GetContext() as WebGL2RenderingContext;


        this.m_BindGroup = bindGroup.GetBindGroup();
        for(let element of this.m_BindGroup)
        {
            switch(element.ResourceType)
            {
               case RESOURCE_TYPE.BUFFER:
                    const uniformBuffer = element.Data as WebGLBuffer
                    m_Webgl.bindBufferBase(m_Webgl.UNIFORM_BUFFER, element.Binding, uniformBuffer); // Bind to binding point 0

                    // Get block index & bind to program
                    const blockIndex = m_Webgl.getUniformBlockIndex(shader.GetModule(), element.Name);
                    m_Webgl.uniformBlockBinding(shader.GetModule(), blockIndex, element.Binding); // Match buffer to shader
                  break;
               case RESOURCE_TYPE.TEXTURE:
               case RESOURCE_TYPE.SAMPLER:
                   const texture = element.Data as Texture
                   texture.Upload();
                   m_Webgl.getUniformLocation(shader.GetModule(), element.Name)
                   shader.SetUniform1i(element.Name, element.Binding); // gonna use binding number as a slot for sampler and textures 
               break;



            }
        }
    }

    public GetRenderPipeline() 
    {

    }
    public GetBindGroup() 
    {
        throw new Error("Method not implemented.");
    }
}
