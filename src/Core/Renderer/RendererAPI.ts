import { Vector4 } from "../Math/Vectors";
import { IndexBuffer } from "./Buffers";
import { Shader } from "./Shader";
import { VertexArray } from "./VertexArray";

export class RendererAPI
{

    private static m_Webgl: WebGLRenderingContext;
    private constructor(){}

    static Init(webgl: WebGLRenderingContext)
    {
        this.m_Webgl = webgl;
    }

    static ClearColor(color: Vector4): void
    {
        this.m_Webgl?.clearColor(color.x,color.y,color.z, color.w);
    }
    static Clear(): void 
    {
        this.m_Webgl?.clear(this.m_Webgl.COLOR_BUFFER_BIT);
    }

    static DrawIndexed(shader: Shader, vertexArray: VertexArray): void
    {
        shader.Bind();
        vertexArray.Bind();

        const indexBuffer = vertexArray.GetIndexBuffer() as IndexBuffer;
        this.m_Webgl.drawElements(this.m_Webgl.TRIANGLES, indexBuffer.GetIndicesCount() ,this.m_Webgl.UNSIGNED_INT, 0);
    }

}
