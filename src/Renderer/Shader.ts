export interface SHADER_SOURCE
{
    VERTEX: string;
    FRAGMENT: string;
}
export abstract class Shader
{
    public abstract Upload(): void;
    public abstract GetModule(): any;
    public abstract GetShaderSources(): SHADER_SOURCE | string;

}
