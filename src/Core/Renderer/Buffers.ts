
export class BufferElement {
    name: string
    type: number;
    count: number;
    normalized: boolean;
    offset: number;

    constructor(type: number, name: string,  count: number, normalized: boolean = false) {
        this.name = name;
        this.type = type;
        this.count = count;
        this.normalized = normalized;
        this.offset = 0;

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
    constructor(bufferLayoutElements: Array<BufferElement>)
    {
        this.m_BufferLayoutElements = bufferLayoutElements;
        this.m_Stride = 0;
        this.CalculateOffsetAndStride();
    }
    public CalculateOffsetAndStride(): void
    {
        this.m_Stride = 0;
        var offset = 0;
        
        this.m_BufferLayoutElements.forEach((element)=>{
            
            element.offset = offset;
            this.m_Stride += element.count * BufferElement.GetSizeOfType(element.type);
            offset += element.count * BufferElement.GetSizeOfType(element.type);

        })
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

export class VertexBuffer
{
    private m_Buffer: WebGLBuffer;
    private m_Webgl: WebGLRenderingContext;
    private m_BufferLayout: BufferLayout | null = null;
    constructor(webgl: WebGLRenderingContext)
    {
        this.m_Webgl = webgl;
        this.m_Buffer = this.m_Webgl.createBuffer();
    } 

    
    public Bind()
    {
        this.m_Webgl.bindBuffer(this.m_Webgl.ARRAY_BUFFER, this.m_Buffer);
    }
    public CreateBuffer(data: Float32Array)
    {
        this.m_Webgl.bindBuffer(this.m_Webgl.ARRAY_BUFFER, this.m_Buffer);
        this.m_Webgl.bufferData(this.m_Webgl.ARRAY_BUFFER, data, this.m_Webgl.STATIC_DRAW);
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

export class IndexBuffer
{

}
