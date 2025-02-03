

export class VertexBuffer
{
  private m_buffer: WebGLBuffer;
  private m_webgl: WebGLRenderingContext;
  constructor(webgl: WebGLRenderingContext)
  {

    this.m_webgl = webgl;
    this.m_buffer = this.m_webgl.createBuffer();
  } 

  public CreateBuffer(data: Float32Array)
  {

    this.m_webgl.bindBuffer(this.m_webgl.ARRAY_BUFFER, this.m_buffer);
    this.m_webgl.bufferData(this.m_webgl.ARRAY_BUFFER, data, this.m_webgl.STATIC_DRAW);

  }
}


class IndexBuffer
{

}
