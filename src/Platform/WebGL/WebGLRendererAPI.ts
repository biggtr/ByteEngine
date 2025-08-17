import { RendererAPI } from "@/Renderer/RendererAPI";
import { context } from "@/Core/Byte";
import { RenderPipeline } from "@/Renderer/RenderPipeline";
import { Vector4 } from "@/Math/Vectors";

export class WebGLRendererAPI extends RendererAPI
{

    private m_Webgl: WebGL2RenderingContext;
    constructor()
    {
        super()
        this.m_Webgl = context.GetContext() as WebGL2RenderingContext;
    }

    public ClearColor(color: Vector4): void 
    {
        this.m_Webgl.clearColor(color.x, color.y, color.z, color.w);
    }

    public Clear(): void 
    {
        this.m_Webgl.clear(this.m_Webgl.COLOR_BUFFER_BIT);
    }


    DrawIndexed(pipeline: RenderPipeline, indexCount: number): void
    {
        const shader = pipeline.GetShaderModule();
        shader.Upload();

        const geometry = pipeline.GetGeometry()
        geometry.Upload();

        const indexBuffer = geometry.GetIndexBuffer();
        indexBuffer.Upload()

        this.m_Webgl.drawElements(this.m_Webgl.TRIANGLES, indexCount ,this.m_Webgl.UNSIGNED_INT, 0);
    }


}
