import { BufferLayout, BufferElement, VertexBuffer, IndexBuffer } from "./Buffers";

export class VertexArray
{
    private m_Webgl: WebGL2RenderingContext;
    private m_VertexArray: WebGLVertexArrayObject;
    private m_VertexBuffers: Array<VertexBuffer> = [];
    private m_IndexBuffer: IndexBuffer | null = null;
    constructor(webgl: WebGL2RenderingContext)
    {
        this.m_Webgl = webgl;
        this.m_VertexArray = this.m_Webgl.createVertexArray();
    }

    public Bind()
    {
        this.m_Webgl.bindVertexArray(this.m_VertexArray);
    }

    public AddVertexBuffer(vertexBuffer: VertexBuffer)
    {
        vertexBuffer.Bind();
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
              location, count, type, normalize, stride, offset)
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
        indexBuffer.Bind();
        this.m_IndexBuffer = indexBuffer;
    }
    public GetIndexBuffer(): IndexBuffer | null
    {
        return this.m_IndexBuffer;
    }

}
