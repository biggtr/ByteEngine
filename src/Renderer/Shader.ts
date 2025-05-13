export interface SHADER_SOURCE
{
    VERTEX: string;
    FRAGMENT: string;
}
export abstract class Shader
{
    public abstract Upload(): void;
    public abstract GetAttributeLocation(attributeName: string) : GLint
    public abstract GetUniformLocation(uniformName: string) : WebGLUniformLocation | null
    public abstract SetUniform1i(uniformName: string, data: number): void 
    public abstract SetMat3(uniformName: string, data: Float32Array): void
}
