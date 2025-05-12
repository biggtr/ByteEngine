import { GraphicsContext } from "@/Renderer/GraphicsContext";

export class WebGLContext extends GraphicsContext
{
    private m_HtmlCanvas: HTMLCanvasElement; 
    private m_webGL!: WebGL2RenderingContext;

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
        this.m_HtmlCanvas.style.width = window.innerWidth + "px";
        this.m_HtmlCanvas.style.height = window.innerHeight + "px";

        this.m_webGL = this.m_HtmlCanvas.getContext("webgl2") as WebGL2RenderingContext;
        if (!this.m_webGL)
        {
            throw new Error('WebGL is not supported in this browser.');
        }
    }
    public GetContext(): WebGL2RenderingContext 
    {
        return this.m_webGL;
    }
}
