import { context } from "@/Core/Byte";
import { BufferLayout, BufferElement, VertexBuffer, IndexBuffer, SHADER_DATA_TYPE} from "@/Renderer/Buffers";
import { Geometry } from "@/Renderer/Geometry";

function GetShaderTypeWebGL(shaderType: SHADER_DATA_TYPE): number
{

    const gl = context.GetContext() as WebGL2RenderingContext;
    switch (shaderType) 
    {
        case SHADER_DATA_TYPE.FLOAT: 
        case SHADER_DATA_TYPE.FLOAT2: 
        case SHADER_DATA_TYPE.FLOAT3: 
        case SHADER_DATA_TYPE.FLOAT4: 
        {
            return gl.FLOAT;
        }
        default: throw new Error("Unknown type!");
    }

}
export class WebGLGeometry extends Geometry
{
    private m_Webgl: WebGL2RenderingContext;
    private m_VertexArray: WebGLVertexArrayObject;
    private m_VertexBuffers: Array<VertexBuffer> = [];
    private m_IndexBuffer: IndexBuffer | null = null;
    constructor()
    {
        super();
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
        const bufferElements = bufferLayout.m_BufferLayoutElements;
        for(let location = 0; location < bufferElements.length; location++)
        {
            this.m_Webgl.bindVertexArray(this.m_VertexArray);
            this.m_Webgl.enableVertexAttribArray(location);
            var count = bufferElements[location].GetComponentCount();          
            var type = bufferElements[location].Type;
            var normalize =  bufferElements[location].Normalized;
            var stride = bufferLayout.GetStride();       
            var offset = bufferElements[location].OffsetInBytes;
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
