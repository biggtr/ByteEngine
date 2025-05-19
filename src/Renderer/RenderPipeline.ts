import { Geometry } from "./Geometry";
import { Shader } from "./Shader";

export abstract class RenderPipeline
{

    public abstract GetRenderPipeline(): any;
    public abstract GetBindGroup(): any;
    public abstract GetGeometry(): Geometry;
    public abstract GetShaderModule(): Shader;
}
