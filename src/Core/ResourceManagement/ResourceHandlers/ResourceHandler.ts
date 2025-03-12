import { Shader, SHADER_SOURCE} from "@/Core/Renderer/Shader";
import fs from "fs"
import readline from "readline"
export interface ResourceHandler<T>
{
    Load(name: string, path: string): Promise<void>;
    Get(name: string): T;
    UnLoad(name: string): void;
}

export class ShaderHandler implements ResourceHandler<Shader>
{
    private m_Shaders: Map<string, Shader> = new Map();
    private m_WebGL!: WebGL2RenderingContext; 
    constructor(webGL: WebGL2RenderingContext)
    {
        this.m_WebGL = webGL;
    }
    async Load(shaderName: string, shaderPath: string): Promise<void>
    {
        const shaderSources = await this.LoadShaderFromFile(shaderPath);
        const newShader = new Shader(this.m_WebGL);
        newShader.Create(shaderSources);
        this.m_Shaders.set(shaderName, newShader);
         
    }
    Get(shaderName: string): Shader
    {
        const shader = this.m_Shaders.get(shaderName);
        if (!shader) {
            throw new Error(`Shader "${shaderName}" not found`);
        }
        return shader;
    }
    UnLoad(shaderName: string): void
    {
        const shader = this.m_Shaders.get(shaderName);
        if (shader) 
        {
            shader.UnBind();
            this.m_Shaders.delete(shaderName);
        }
    }

    private async LoadShaderFromFile(shaderPath: string): Promise<SHADER_SOURCE>
    {
        const response = await fetch(shaderPath);
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
            
