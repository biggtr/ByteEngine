import { GraphicsContext } from "@/Renderer/GraphicsContext";

export class WebGLContext extends GraphicsContext
{
    private m_HtmlCanvas: HTMLCanvasElement; 
    private m_Webgl!: WebGL2RenderingContext;
    private m_Width: number = 0;
    private m_Height: number = 0;

    constructor(canvasID: string)
    {
        super();
        this.m_HtmlCanvas = document.getElementById(canvasID) as HTMLCanvasElement;
    }

    public async Init() : Promise<void>
    {
        const dpr = window.devicePixelRatio || 1;

        this.m_HtmlCanvas.width = window.innerWidth * dpr;
        this.m_HtmlCanvas.height = window.innerHeight * dpr
        this.m_Width = this.m_HtmlCanvas.width
        this.m_Height = this.m_HtmlCanvas.height
        this.m_HtmlCanvas.style.width = window.innerWidth + "px";
        this.m_HtmlCanvas.style.height = window.innerHeight + "px";

        this.m_Webgl = this.m_HtmlCanvas.getContext("webgl2") as WebGL2RenderingContext;
        if (!this.m_Webgl)
        {
            throw new Error('WebGL is not supported in this browser.');
        }
        this.m_Webgl.enable(this.m_Webgl.DEPTH_TEST);
        this.m_Webgl.disable(this.m_Webgl.CULL_FACE)
        this.m_Webgl.depthFunc(this.m_Webgl.LEQUAL);
        this.m_Webgl.enable(this.m_Webgl.BLEND);
        this.m_Webgl.blendFunc(this.m_Webgl.SRC_ALPHA, this.m_Webgl.ONE_MINUS_SRC_ALPHA);
        this.m_Webgl.clearDepth(1.0);
    }
    public GetWidth(): number 
    {
        return this.m_Width;     
    }
    public GetHeight(): number 
    {
        return this.m_Height
    }
    public GetContext(): WebGL2RenderingContext 
    {
        return this.m_Webgl;
    }
}
