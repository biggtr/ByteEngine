
export interface WebGPUContextData
{
    Adapter: GPUAdapter;
    Device: GPUDevice;
    Context: GPUCanvasContext;
}
export abstract class GraphicsContext
{
    public abstract Init(): Promise<void>
    public abstract GetContext(): WebGL2RenderingContext | WebGPUContextData
    
}


