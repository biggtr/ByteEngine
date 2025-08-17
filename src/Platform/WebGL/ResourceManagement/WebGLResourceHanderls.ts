import { Shader, SHADER_SOURCE } from "@/Renderer/Shader";
import { ShaderFactory } from "@/Renderer/ShaderFactory";
import { Texture } from "@/Renderer/Texture";
import { TextureFactory } from "@/Renderer/TextureFactory";
import { ResourceHandler } from "@/ResourceManagement/ResourceHandlers";

export class WebGLTextureHandler implements ResourceHandler<Texture>
{
    private m_Textures: Map<string, Texture> = new Map();
    constructor()
    {
    } 
    async Load(name: string, path: string): Promise<Texture>
    {
        const textureImage = await this.LoadFromImage(path);
        const texture = TextureFactory.Create(textureImage);
        if(this.m_Textures.get(name))
        {
            console.log("Texture is already loaded!..");
        }
        this.m_Textures.set(name, texture);
        return texture;
    }
    Get(name: string): Texture 
    {
        const texture= this.m_Textures.get(name);
        if (!texture) {
            throw new Error(`Texture "${name}" not found`);
        }
        return texture;
    }
    UnLoad(name: string): void
    {
        const texture= this.m_Textures.get(name);
        if (texture) 
        {
            texture.Destroy();
            this.m_Textures.delete(name);
        }
    }
    private async LoadFromImage(path: string): Promise<ImageBitmap>
    {

        try
        {
            const response = await fetch(path);
            if(!response.ok)
            {
                throw new Error("Failed To Load Texture..!");
            }
            const blob = await response.blob(); 
            return await createImageBitmap(blob, {
                colorSpaceConversion: "none", 
                imageOrientation: "flipY",
                premultiplyAlpha: "none"  
            });

        }
        catch(error)
        {
            throw new Error("Failed To Load Texture..!");
        }
    }
}
export class WebGLShaderHandler implements ResourceHandler<Shader>
{
    private m_Shaders: Map<string, Shader> = new Map();
    constructor()
    {
    }
    async Load(name: string, path: string): Promise<void>
    {
        const shaderSources = await this.LoadShaderFromFile(path);
        const newShader = ShaderFactory.Create(shaderSources);
        if(this.m_Shaders.get(name))
        {
            console.log("Shader is already loaded!..");
        }
        this.m_Shaders.set(name, newShader);
         
    }
    Get(name: string): Shader
    {
        const shader = this.m_Shaders.get(name);
        if (!shader) {
            throw new Error(`Shader "${name}" not found`);
        }
        return shader;
    }
    UnLoad(name: string): void
    {
        const shader = this.m_Shaders.get(name);
        if (shader) 
        {
            this.m_Shaders.delete(name);
        }
    }

}
