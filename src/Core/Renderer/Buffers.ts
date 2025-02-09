
export class VertexBuffer
{
  private m_Buffer: WebGLBuffer;
  private m_Webgl: WebGLRenderingContext;
  constructor(webgl: WebGLRenderingContext)
  {

    this.m_Webgl = webgl;
    this.m_Buffer = this.m_Webgl.createBuffer();
  } 

  public CreateBuffer(data: Float32Array)
  {

    this.m_Webgl.bindBuffer(this.m_Webgl.ARRAY_BUFFER, this.m_Buffer);
    this.m_Webgl.bufferData(this.m_Webgl.ARRAY_BUFFER, data, this.m_Webgl.STATIC_DRAW);

  }

}

export class BufferElement {
    type: number;
    count: number;
    normalized: boolean;

    constructor(type: number, count: number, normalized: boolean = false) {
        this.type = type;
        this.count = count;
        this.normalized = normalized;
    }

    static GetSizeOfType(type: number): number {
        switch (type) {
            case WebGL2RenderingContext.FLOAT: return 4;
            case WebGL2RenderingContext.UNSIGNED_INT: return 4;
            case WebGL2RenderingContext.UNSIGNED_BYTE: return 1;
            default: throw new Error("Unknown type!");
        }
    }

}
export class BufferLayout
{
    private m_BufferLayoutElements: Array<BufferElement>;
    private m_Stride: number;
    constructor()
    {
        this.m_BufferLayoutElements = [];
        this.m_Stride = 0;
    }
    public PushFloat(count: number): void 
    {
        
       this.m_BufferLayoutElements.push(new BufferElement(WebGL2RenderingContext.FLOAT, count, false));
       this.m_Stride += BufferElement.GetSizeOfType(WebGL2RenderingContext.FLOAT) * count;
    }

    public PushUnsignedInt(count: number): void 
    {
        this.m_BufferLayoutElements.push(new BufferElement(WebGL2RenderingContext.UNSIGNED_INT, count, false));
        this.m_Stride += BufferElement.GetSizeOfType(WebGL2RenderingContext.UNSIGNED_INT) * count;
    }

    public PushUnsignedByte(count: number): void 
    {
        this.m_BufferLayoutElements.push(new BufferElement(WebGL2RenderingContext.UNSIGNED_BYTE, count, true));
        this.m_Stride += BufferElement.GetSizeOfType(WebGL2RenderingContext.UNSIGNED_BYTE) * count;
    }

    public GetBufferElements(): Array<BufferElement>
    {
        return this.m_BufferLayoutElements;
    }

    public GetStride(): number
    {
        return this.m_Stride;
    }

}
class IndexBuffer
{

}
