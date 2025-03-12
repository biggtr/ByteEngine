import { Shader, SHADER_SOURCE} from "@/Core/Renderer/Shader";
import fs from "fs"
import readline from "readline"
export interface ResourceHandler<T>
{
    Load(name: string, path: string): Promise<void>;
    Get(path: string): T;
    UnLoad(path: string): void;
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
        const shaderSources = await this.loadShaderFromFile(shaderPath);
        const newShader = new Shader(this.m_WebGL);
        newShader.Create(shaderSources);
        this.m_Shaders.set(shaderName, newShader);
         
    }
    Get(shaderName: string): Shader
    {
        return this.m_Shaders.get(shaderName) as Shader;
    }
    UnLoad(shaderName: string): void
    {

    }

    private async loadShaderFromFile(shaderPath: string): Promise<SHADER_SOURCE> {
        return new Promise((resolve, reject) => {
            var shaderSources: SHADER_SOURCE = {
                VERTEX: '',
                FRAGMENT: ''
            };

            let vertexFlag = false;
            let fragmentFlag = false;
            
            const fileStream = fs.createReadStream(shaderPath);
            const rl = readline.createInterface({input: fileStream, crlfDelay: Infinity});
            
            rl.on("line", (line) => {
                if(line === "#Vertex") {
                    vertexFlag = true;
                    fragmentFlag = false;
                    return; 
                }
                if(line === "#Fragment") {
                    fragmentFlag = true;
                    vertexFlag = false;
                    return;
                }
                
                if(vertexFlag) {
                    shaderSources.VERTEX += line + '\n';
                }
                if(fragmentFlag) {
                    shaderSources.FRAGMENT += line + '\n';
                }
            });
            
            rl.on("close", () => {
                resolve(shaderSources);
            });
            
            rl.on("error", (err) => {
                reject(err);
            });
        });
    }
}
