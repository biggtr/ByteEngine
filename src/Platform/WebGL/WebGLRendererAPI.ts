import { Vector4 } from "@/Math/Vectors";
import { GraphicsContext } from "@/Renderer/GraphicsContext";
import { VertexArray } from "@/Renderer/VertexArray";
import { WebGLIndexBuffer } from "./WebGLBuffers";
import { RendererAPI } from "@/Renderer/RendererAPI";

export class WebGLRendererAPI extends RendererAPI
{

    private m_Webgl: WebGL2RenderingContext;
    private m_GraphicsContext: GraphicsContext
    constructor(graphicsContext: GraphicsContext)
    {
        super()
        this.m_GraphicsContext = graphicsContext;
        this.m_Webgl = graphicsContext.GetContext() as WebGL2RenderingContext;
    }


    ClearColor(color: Vector4): void
    {
        this.m_Webgl.clearColor(color.x,color.y,color.z, color.w);
    }
    Clear(): void 
    {
        this.m_Webgl.clear(this.m_Webgl.COLOR_BUFFER_BIT);
    }

    DrawIndexed(vertexArray: VertexArray): void
    {
        vertexArray.Bind();

        const indexBuffer = vertexArray.GetIndexBuffer() as WebGLIndexBuffer;
        this.m_Webgl.drawElements(this.m_Webgl.TRIANGLES, indexBuffer.GetIndicesCount() ,this.m_Webgl.UNSIGNED_INT, 0);
    }

    GetWebGLContext(): GraphicsContext
    {
        return this.m_GraphicsContext;
    }

}
