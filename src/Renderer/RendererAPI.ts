import { RenderPipeline } from "./RenderPipeline";


export enum RENDERER_API
{
    WEBGL, WEBGPU
}
export abstract class RendererAPI
{
    public static s_API: RENDERER_API = RENDERER_API.WEBGL;

        
    public abstract BeginScene(): void;
    public abstract DrawIndexed(pipeline: RenderPipeline): void
    public abstract EndScene(): void;
}
