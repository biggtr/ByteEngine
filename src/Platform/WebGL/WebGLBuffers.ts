import { context } from "@/Core/Byte";
import { AlignTo16, BUFFER_TYPE, BufferLayout, IndexBuffer, VertexBuffer } from "@/Renderer/Buffers";

export class WebGLVertexBuffer extends VertexBuffer
{
    private m_Buffer: WebGLBuffer;
    private m_Webgl: WebGL2RenderingContext;
    private m_Data: Float32Array
    private m_BufferLayout!: BufferLayout; 
    private m_BufferType: BUFFER_TYPE;

    constructor(data: Float32Array, bufferType: BUFFER_TYPE)
    {
        super()
        this.m_BufferType = bufferType;
        this.m_Webgl = context.GetContext() as WebGL2RenderingContext;
        this.m_Buffer = this.m_Webgl.createBuffer();
        this.m_Data = data
    }
    public GetBuffer(): WebGLBuffer
    {
        return this.m_Buffer
    }
    public Upload(): void
    {
        switch(this.m_BufferType)
        {
            case BUFFER_TYPE.VERTEX:
                this.m_Webgl.bindBuffer(this.m_Webgl.ARRAY_BUFFER, this.m_Buffer);
                this.m_Webgl.bufferData(this.m_Webgl.ARRAY_BUFFER, this.m_Data, this.m_Webgl.STATIC_DRAW);
                break;
            case BUFFER_TYPE.UNIFORM:
                this.m_Webgl.bindBuffer(this.m_Webgl.UNIFORM_BUFFER, this.m_Buffer);
                this.m_Webgl.bufferData(
                    this.m_Webgl.UNIFORM_BUFFER,
                    this.m_Data,
                    this.m_Webgl.DYNAMIC_DRAW
                )
                break;
        }
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
    constructor(indices: Uint32Array, count: number)
    {
        super();
        this.m_Webgl = context.GetContext() as WebGL2RenderingContext;
        this.m_IndexBuffer = this.m_Webgl.createBuffer();
        this.m_Count = count;
        this.m_Webgl.bindBuffer(this.m_Webgl.ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer);
        this.m_Webgl.bufferData(this.m_Webgl.ELEMENT_ARRAY_BUFFER, indices, this.m_Webgl.STATIC_DRAW);
    }

    public GetBuffer(): WebGLBuffer
    {
        return this.m_IndexBuffer;
    }
    public Upload(): void 
    {
        this.m_Webgl.bindBuffer(this.m_Webgl.ELEMENT_ARRAY_BUFFER, this.m_IndexBuffer);
    }
    public GetIndicesCount()
    {
        return this.m_Count; 
    }

}
