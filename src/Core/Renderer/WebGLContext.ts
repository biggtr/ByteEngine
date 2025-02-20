export class WebGLContext
{
  private m_htmlCanvas: HTMLCanvasElement;
  private m_webGL: WebGL2RenderingContext;

  constructor(canvasID: string)
  {
    this.m_htmlCanvas = document.getElementById(canvasID) as HTMLCanvasElement;
    if(!this.m_htmlCanvas)
    {
      throw new Error(`Canvas with id ${canvasID} is not found.`);
    }
    this.m_webGL = this.CreateWebGLContext() as WebGL2RenderingContext;
    if(!this.m_webGL)
    {
    throw new Error(`Couldn't intialize WebGL Context`);
    }
    const dpr = window.devicePixelRatio || 1;

    this.m_htmlCanvas.width = window.innerWidth * dpr;
    this.m_htmlCanvas.height = window.innerHeight * dpr
    this.m_htmlCanvas.style.width = window.innerWidth + "px";
    this.m_htmlCanvas.style.height = window.innerHeight + "px";
  }

  private CreateWebGLContext() : WebGL2RenderingContext | null
  {

    const gl= this.m_htmlCanvas.getContext("webgl2") as WebGL2RenderingContext;
    if (!gl)
    {
      throw new Error('WebGL is not supported in this browser.');
      return null;
    }
    return gl as WebGL2RenderingContext;
  }
  public GetWebGL() : WebGL2RenderingContext
  {
    return this.m_webGL;
  }
}
