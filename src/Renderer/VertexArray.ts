import { context } from "@/Core/Byte";
import { BufferLayout, BufferElement, VertexBuffer, IndexBuffer, SHADER_TYPE} from "./Buffers";


function GetShaderTypeWebGL(shaderType: SHADER_TYPE): number
{

    const gl = context.GetContext() as WebGL2RenderingContext;
    switch (shaderType) 
    {
        case SHADER_TYPE.FLOAT:  return gl.FLOAT;
        case SHADER_TYPE.FLOAT2: return  gl.FLOAT * 4;
        case SHADER_TYPE.FLOAT3: return 4 * 3;
        case SHADER_TYPE.FLOAT4: return 4 * 4;
        default: throw new Error("Unknown type!");
    }

}
export class VertexArray
{
    private m_Webgl: WebGL2RenderingContext;
    private m_VertexArray: WebGLVertexArrayObject;
    private m_VertexBuffers: Array<VertexBuffer> = [];
    private m_IndexBuffer: IndexBuffer | null = null;
    constructor()
    {
        this.m_Webgl = context.GetContext() as WebGL2RenderingContext;
        this.m_VertexArray = this.m_Webgl.createVertexArray();
    }

    public Upload()
    {
        this.m_Webgl.bindVertexArray(this.m_VertexArray);
    }

    public AddVertexBuffer(vertexBuffer: VertexBuffer)
    {
        vertexBuffer.Upload();
        const bufferLayout = vertexBuffer.GetLayout() as BufferLayout;
        const bufferElements = bufferLayout.GetBufferElements() as Array<BufferElement>
        for(let location = 0; location < bufferElements.length; location++)
        {
            this.m_Webgl.bindVertexArray(this.m_VertexArray);
            this.m_Webgl.enableVertexAttribArray(location);
            var count = bufferElements[location].count;          
            var type = bufferElements[location].type;
            var normalize =  bufferElements[location].normalized;
            var stride = bufferLayout.GetStride();       
            var offset = bufferElements[location].offset;
            this.m_Webgl.vertexAttribPointer(
              location, count, GetShaderTypeWebGL(type), normalize, stride, offset)
        }
        this.m_VertexBuffers.push(vertexBuffer); 

    }
    
    public GetVertexBuffers(): VertexBuffer[]
    {
        return this.m_VertexBuffers;
    }

    public SetIndexBuffer(indexBuffer: IndexBuffer)
    {
        this.m_Webgl.bindVertexArray(this.m_VertexArray);
        indexBuffer.Upload();
        this.m_IndexBuffer = indexBuffer;
    }
    public GetIndexBuffer(): IndexBuffer | null
    {
        return this.m_IndexBuffer;
    }

}
