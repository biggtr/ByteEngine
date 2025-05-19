import { RendererAPI } from "@/Renderer/RendererAPI";
import { context } from "@/Core/Byte";
import { RenderPipeline } from "@/Renderer/RenderPipeline";

export class WebGLRendererAPI extends RendererAPI
{

    private m_Webgl: WebGL2RenderingContext;
    constructor()
    {
        super()
        this.m_Webgl = context.GetContext() as WebGL2RenderingContext;
    }

    public BeginScene(): void 
    {
        this.m_Webgl.clearColor(1.0, 1.0, 1.0, 1.0);
        this.m_Webgl.clear(this.m_Webgl.COLOR_BUFFER_BIT);
    }
    public EndScene(): void 
    {

    }


    DrawIndexed(pipeline: RenderPipeline): void
    {
        const shader = pipeline.GetShaderModule();
        shader.Upload();

        const geometry = pipeline.GetGeometry()
        geometry.Upload();

        const indexBuffer = geometry.GetIndexBuffer();
        indexBuffer.Upload()

        this.m_Webgl.drawElements(this.m_Webgl.TRIANGLES, indexBuffer.GetIndicesCount() ,this.m_Webgl.UNSIGNED_INT, 0);
    }


}
