import { Shader } from "../../Renderer/Shader";
import { ResourceHandler, ResourceType } from "./ResourceHandler";

export class ShaderHandler implements ResourceHandler<Shader>
{
    
    Load(path: string): Promise<Shader>
    {

    }
    Get(path: string): T;
    UnLoad(path: string): void;
}
