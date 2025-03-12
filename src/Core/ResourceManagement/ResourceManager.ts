import { Shader } from "../Renderer/Shader"
import { Texture } from "../Renderer/Texture";
import { ResourceHandler } from "./ResourceHandlers/ResourceHandler";


export class ResourceManager
{
    private m_ResourceHandlers: Map<string, ResourceHandler<any>> = new Map();
}
