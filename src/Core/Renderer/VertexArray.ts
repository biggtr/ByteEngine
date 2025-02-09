import { BufferLayout, BufferElement } from "./Buffers";

export class VertexArray
{
    private m_Webgl: WebGL2RenderingContext;
    private m_VertexArray: WebGLVertexArrayObject;
    constructor(webgl: WebGL2RenderingContext)
    {
        this.m_Webgl = webgl;
        this.m_VertexArray = this.m_Webgl.createVertexArray();
    }

    public Bind()
    {
        this.m_Webgl.bindVertexArray(this.m_VertexArray);
    }

    public AddBufferLayout(bufferLayout: BufferLayout)
    {
        const bufferElements = bufferLayout.GetBufferElements();
        var offset = 0;      

        for(let location = 0; location < bufferElements.length; location++)
        {
            this.m_Webgl.bindVertexArray(this.m_VertexArray);
            this.m_Webgl.enableVertexAttribArray(location);
            var count = bufferElements[location].count;          
            var type = bufferElements[location].type;
            var normalize =  bufferElements[location].normalized;
            var stride = bufferLayout.GetStride();       

            this.m_Webgl.vertexAttribPointer(
              location, count, type, normalize, stride, offset)
            offset += bufferElements[location].count * BufferElement.GetSizeOfType(type);
        }
    }
}
