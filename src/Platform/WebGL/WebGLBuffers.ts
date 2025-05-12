import { BufferLayout, IndexBuffer, VertexBuffer } from "@/Renderer/Buffers";

export class WebGLVertexBuffer extends VertexBuffer
{
    private m_Buffer: WebGLBuffer;
    private m_Webgl: WebGLRenderingContext;
    private m_BufferLayout: BufferLayout | null = null;

    constructor(webgl: WebGLRenderingContext)
    {
        super()
        this.m_Webgl = webgl;
        this.m_Buffer = this.m_Webgl.createBuffer();
    } 

    
    public Bind()
    {
        this.m_Webgl.bindBuffer(this.m_Webgl.ARRAY_BUFFER, this.m_Buffer);
    }
    public Init(data: Float32Array)
    {
        this.m_Webgl.bindBuffer(this.m_Webgl.ARRAY_BUFFER, this.m_Buffer);
        this.m_Webgl.bufferData(this.m_Webgl.ARRAY_BUFFER, data, this.m_Webgl.STATIC_DRAW);
    }

    public UpdateSubData(data: Float32Array, offset: number)
    {
        this.m_Webgl.bindBuffer(this.m_Webgl.ARRAY_BUFFER, this.m_Buffer);
        this.m_Webgl.bufferSubData(this.m_Webgl.ARRAY_BUFFER, offset, data);
    }
    public SetLayout(bufferLayout: BufferLayout)
    {
        this.m_BufferLayout = bufferLayout;
    }
    public GetLayout(): BufferLayout | null
    {
        return this.m_BufferLayout;
    }
}

export class WebGLIndexBuffer extends IndexBuffer
{

    private m_Webgl: WebGLRenderingContext;
    private m_IndexBuffer: WebGLBuffer 
    private m_Count: number = 0;
    constructor(webgl: WebGLRenderingContext)
    {
        super();
        this.m_Webgl = webgl;
        this.m_IndexBuffer = this.m_Webgl.createBuffer();
    }

    public Bind()
    {
        this.m_Webgl.bindBuffer(this.m_Webgl.ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer);
    }
    public Init(indices: Uint32Array, count: number): void
    {
        this.m_Count = count;
        this.m_Webgl.bindBuffer(this.m_Webgl.ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer);
        this.m_Webgl.bufferData(this.m_Webgl.ELEMENT_ARRAY_BUFFER, indices, this.m_Webgl.STATIC_DRAW);
    }
    public GetIndicesCount()
    {
        return this.m_Count; 
    }

}
