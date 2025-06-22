
export interface WebGPUContextData
{
    Adapter: GPUAdapter;
    Device: GPUDevice;
    Context: GPUCanvasContext;
    Canvas: HTMLCanvasElement
}
export abstract class GraphicsContext
{
    public abstract Init(): Promise<void>
    public abstract GetContext(): WebGL2RenderingContext | WebGPUContextData
    public abstract GetWidth(): number
    public abstract GetHeight(): number
    
}


