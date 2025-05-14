import { Shader } from "@/Renderer/Shader";

export class WebGPUShader extends Shader
{
    public Upload(): void {
        throw new Error("Method not implemented.");
    }
    public GetAttributeLocation(attributeName: string): GLint {
        throw new Error("Method not implemented.");
    }
    public GetUniformLocation(uniformName: string): WebGLUniformLocation | null {
        throw new Error("Method not implemented.");
    }
    public SetUniform1i(uniformName: string, data: number): void {
        throw new Error("Method not implemented.");
    }
    public SetMat3(uniformName: string, data: Float32Array): void {
        throw new Error("Method not implemented.");
    }

}
