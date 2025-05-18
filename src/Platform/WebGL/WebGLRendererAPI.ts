import { Vector4 } from "@/Math/Vectors";
import { WebGLIndexBuffer } from "./WebGLBuffers";
import { RendererAPI } from "@/Renderer/RendererAPI";
import { context } from "@/Core/Byte";
import { Geometry } from "@/Renderer/Geometry";

export class WebGLRendererAPI extends RendererAPI
{

    private m_Webgl: WebGL2RenderingContext;
    constructor()
    {
        super()
        this.m_Webgl = context.GetContext() as WebGL2RenderingContext;
    }


    ClearColor(color: Vector4): void
    {
        this.m_Webgl.clearColor(color.x,color.y,color.z, color.w);
    }
    Clear(): void 
    {
        this.m_Webgl.clear(this.m_Webgl.COLOR_BUFFER_BIT);
    }

    DrawIndexed(geometry: Geometry ): void
    {
        geometry.Upload();
        const indexBuffer = geometry.GetIndexBuffer() as WebGLIndexBuffer;
        indexBuffer.Upload()
        this.m_Webgl.drawElements(this.m_Webgl.TRIANGLES, indexBuffer.GetIndicesCount() ,this.m_Webgl.UNSIGNED_INT, 0);
    }


}
