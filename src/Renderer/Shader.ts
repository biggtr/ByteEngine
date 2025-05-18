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

    public GetAttributeLocation(attributeName: string) : GLint{}
    public GetUniformLocation(uniformName: string) : WebGLUniformLocation | null{}
    public SetUniform1i(uniformName: string, data: number): void {}
    public SetMat4(uniformName: string, data: Float32Array): void{}
    public SetMat3(uniformName: string, data: Float32Array): void{}
}
