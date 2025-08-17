import { Vector4 } from "@/Math/Vectors";
import { RenderPipeline } from "./RenderPipeline";


export enum RENDERER_API
{
    WEBGL, WEBGPU
}
export abstract class RendererAPI
{
    public static s_API: RENDERER_API = RENDERER_API.WEBGL;

    public abstract ClearColor(color: Vector4): void;
    public abstract Clear(): void;
    public abstract DrawIndexed(pipeline: RenderPipeline, indexCount: number): void;
}
