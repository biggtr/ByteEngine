
export class VertexArray
{
    private m_webgl: WebGL2RenderingContext;
    private m_vertexArray: WebGLVertexArrayObject;
    constructor(webgl: WebGL2RenderingContext)
    {
        this.m_webgl = webgl;
        this.m_vertexArray = this.m_webgl.createVertexArray();
    }

    public Bind()
    {
        this.m_webgl.bindVertexArray(this.m_vertexArray);
    }
        
}
