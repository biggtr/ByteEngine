class WebGLContext
{
  private m_htmlCanvas: HTMLCanvasElement;
  private m_webGL: WebGLRenderingContext;

  constructor(canvasID: string)
  {
    this.m_htmlCanvas = document.getElementById(canvasID) as HTMLCanvasElement;
    if(!this.m_htmlCanvas)
    {
      throw new Error(`Canvas with id ${canvasID} is not found.`);
    }
    this.m_webGL = this.CreateWebGLContext() as WebGLRenderingContext;
    if(!this.m_webGL)
    {
      throw new Error(`Couldn't intialize WebGL Context`);
    }
  }

  private CreateWebGLContext() : WebGLRenderingContext | null
  {

    const gl= this.m_htmlCanvas.getContext("webgl") as WebGLRenderingContext;
    if (!gl)
    {
      throw new Error('WebGL is not supported in this browser.');
      return null;
    }
    return gl as WebGLRenderingContext;
  }
  public GetWebGL() : WebGLRenderingContext
  {
    return this.m_webGL;
  }
}
