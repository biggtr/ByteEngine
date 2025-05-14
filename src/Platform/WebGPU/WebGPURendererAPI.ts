import { Vector4 } from "@/Math/Vectors";
import { Geometry } from "@/Renderer/Geometry";
import { RendererAPI } from "@/Renderer/RendererAPI";

export class WebGPURendererAPI extends RendererAPI
{
    public ClearColor(color: Vector4): void {
        throw new Error("Method not implemented.");
    }
    public Clear(): void {
        throw new Error("Method not implemented.");
    }
    public DrawIndexed(Geometry: Geometry): void {
        throw new Error("Method not implemented.");
    }

}
