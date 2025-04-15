import { Shader, SHADER_SOURCE } from "@/Renderer/Shader";
import { Texture } from "@/Renderer/Texture";
import fs from "fs"
import readline from "readline"
export interface ResourceHandler<T>
{
    Load(name: string, path: string): Promise<void>;
    Get(name: string): T;
    UnLoad(name: string): void;
}

export class TextureHandler implements ResourceHandler<Texture>
{
    private m_Textures: Map<string, Texture> = new Map();
    private m_WebGL!: WebGL2RenderingContext; 
    constructor(webGL: WebGL2RenderingContext)
    {
        this.m_WebGL = webGL;
    }
    async Load(name: string, path: string): Promise<void>
    {
        const textureImage = await this.LoadFromImage(path);
        const texture = new Texture(this.m_WebGL);
        texture.Create(textureImage);
        if(this.m_Textures.get(name))
        {
            console.log("Texture is already loaded!..");
        }
        this.m_Textures.set(name, texture);
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
            texture.UnBind();
            this.m_Textures.delete(name);
        }
    }
    private async LoadFromImage(path: string): Promise<HTMLImageElement>
    {

        try
        {
            const response = await fetch(path);
            if(!response.ok)
            {
                throw new Error("Failed To Load Texture..!");
            }
            const blob = await response.blob(); 
            const objectURL = URL.createObjectURL(blob);

            const image = new Image()
            await new Promise((resolve, reject) =>{

                image.onload = resolve;
                image.onerror = reject;
                image.src = objectURL;
            });

            return image;

        }
        catch(error)
        {
            throw new Error("Failed To Load Texture..!");
        }
    }
}
export class ShaderHandler implements ResourceHandler<Shader>
{
    private m_Shaders: Map<string, Shader> = new Map();
    private m_WebGL!: WebGL2RenderingContext; 
    constructor(webGL: WebGL2RenderingContext)
    {
        this.m_WebGL = webGL;
    }
    async Load(name: string, path: string): Promise<void>
    {
        const shaderSources = await this.LoadShaderFromFile(path);
        const newShader = new Shader(this.m_WebGL);
        newShader.Create(shaderSources);
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
            shader.UnBind();
            this.m_Shaders.delete(name);
        }
    }

    private async LoadShaderFromFile(path: string): Promise<SHADER_SOURCE>
    {
        const response = await fetch(path);
        const content = await response.text();
        return this.ParseShaderContent(content);
    }


    private ParseShaderContent(content: string): SHADER_SOURCE 
    {

        let vertex = "";

        let fragment = "";
        let current: "vertex" | "fragment" | null = null;

        content.split('\n').forEach(line => {
            if(line.includes('#Vertex'))
            {
                current = 'vertex';
                return;
            }

        
          
            else if(line.includes('#Fragment'))
            {
                current = 'fragment';
                return; 
            }
            else if(current === 'vertex') vertex += line + '\n';
            else if(current === 'fragment') fragment += line + '\n';
        });

        return { VERTEX: vertex, FRAGMENT: fragment };
  }
}
            
