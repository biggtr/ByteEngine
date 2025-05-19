import { GraphicsContext, WebGPUContextData } from "@/Renderer/GraphicsContext";


export class WebGPUContext extends GraphicsContext
{
    private m_WebGPUContext!: WebGPUContextData;
    private m_HtmlCanvas: HTMLCanvasElement;

    constructor(canvasID: string)
    {
        super();
        this.m_HtmlCanvas = document.getElementById(canvasID) as HTMLCanvasElement;
        
    }

    public async Init() : Promise<void>
    {
        const dpr = window.devicePixelRatio || 1;

        // Set canvas size in CSS pixels
        this.m_HtmlCanvas.style.width = window.innerWidth + "px";
        this.m_HtmlCanvas.style.height = window.innerHeight + "px";

        // Set canvas size in actual pixels considering device pixel ratio
        this.m_HtmlCanvas.width = Math.floor(window.innerWidth * dpr);
        this.m_HtmlCanvas.height = Math.floor(window.innerHeight * dpr);
        
        console.log("Initializing WebGPU...!");
        const entry = navigator.gpu;
        if(!entry)
        {
            throw Error("Your browser doesn't support webgpu");
        }
        const adapter: GPUAdapter | null = await entry?.requestAdapter(); 
        if(!adapter)
        {
            throw Error("Your GPU Doesn't support WebGPU");
        }
        const device: GPUDevice | null = await adapter?.requestDevice();
        if(!device)
        {

            throw Error("Your GPU Doesn't support WebGPU");
        }
        const context: GPUCanvasContext | null = this.m_HtmlCanvas.getContext("webgpu");
        if(!context)
        {
            throw Error("Didn't Find Webgpu Context..!");
        }
        const canvasConfigurations: GPUCanvasConfiguration = {
            device: device,
            format: navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: "opaque",
            
            

        };
        context.configure(canvasConfigurations);
        this.m_WebGPUContext = {
            Adapter: adapter,
            Device: device,
            Context: context,
            Canvas: this.m_HtmlCanvas
        };
    }
    public GetContext(): WebGPUContextData
    {
        return this.m_WebGPUContext;
    }
}
