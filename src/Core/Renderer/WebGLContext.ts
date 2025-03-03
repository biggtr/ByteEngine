export class WebGLContext
{
    private m_htmlCanvas: HTMLCanvasElement | null; 
    private m_webGL: WebGL2RenderingContext;

    constructor(canvasID: string)
    {
        this.m_htmlCanvas = null;
        this.m_webGL = this.Create(canvasID) as WebGL2RenderingContext;
    }

    private Create(canvasID: string) : WebGL2RenderingContext | null
    {
        this.m_htmlCanvas = document.getElementById(canvasID) as HTMLCanvasElement;
        if(!this.m_htmlCanvas)
        {
            throw new Error(`Canvas with id ${canvasID} is not found.`);
        }
        const dpr = window.devicePixelRatio || 1;

        this.m_htmlCanvas.width = window.innerWidth * dpr;
        this.m_htmlCanvas.height = window.innerHeight * dpr
        this.m_htmlCanvas.style.width = window.innerWidth + "px";
        this.m_htmlCanvas.style.height = window.innerHeight + "px";

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
    return this.m_webGL as WebGL2RenderingContext;
  }
}
