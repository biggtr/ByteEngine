import { Shader } from "../Renderer/Shader"
import { Texture } from "../Renderer/Texture";
import { ResourceHandler } from "./ResourceHandlers/ResourceHandlers";
export enum HANDLER_TYPE
{
    SHADER, TEXTURE
}
export class ResourceManager
{
    private m_ResourceHandlers: Map<HANDLER_TYPE, ResourceHandler<any>> = new Map();

    public RegisterHandler(handlerType: HANDLER_TYPE, handler: ResourceHandler<any>): void
    {
        if(!this.m_ResourceHandlers.get(handlerType))
        {
            this.m_ResourceHandlers.set(handlerType, handler);
            return;
        }
        throw new Error("Handler already exists..")
    }
    
    public GetHandler(handlerType: HANDLER_TYPE): ResourceHandler<any>
    {
        return this.m_ResourceHandlers.get(handlerType) as ResourceHandler<any>;
    }

}
