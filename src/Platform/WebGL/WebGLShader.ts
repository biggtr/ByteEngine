import { context } from "@/Core/Byte";
import { Shader, SHADER_SOURCE } from "@/Renderer/Shader";

export class WebGlShader extends Shader
{
    private m_ShaderProgram: WebGLProgram | null = null;
    private m_Webgl: WebGL2RenderingContext;
    private m_ShaderSources: SHADER_SOURCE;
    constructor(shaderSources: SHADER_SOURCE)
    {
        super()
        this.m_ShaderSources = shaderSources;
        this.m_Webgl = context.GetContext() as WebGL2RenderingContext;
        const vertexShader = this.CompileShader(shaderSources.VERTEX, this.m_Webgl.VERTEX_SHADER) as WebGLShader;
        const fragmentShader = this.CompileShader(shaderSources.FRAGMENT, this.m_Webgl.FRAGMENT_SHADER) as WebGLShader;
        this.m_ShaderProgram = this.CreateProgram(vertexShader, fragmentShader) as WebGLProgram;
        this.m_Webgl.useProgram(this.m_ShaderProgram);
    }
    public Upload(): void 
    {
        this.m_Webgl.useProgram(this.m_ShaderProgram);
    }

    public GetModule(): WebGLProgram | null
    {
        return this.m_ShaderProgram;
    }
    public GetShaderSources(): SHADER_SOURCE 
    {
        return this.m_ShaderSources;
    }
    

    private CompileShader(shaderSource: string, type: number) : WebGLShader | null
    {
        const shader = this.m_Webgl.createShader(type);
        if(!shader) 
        {
          console.error("Could not create a shader");
          return null;
        }
        this.m_Webgl.shaderSource(shader, shaderSource);
        this.m_Webgl.compileShader(shader);
        if (!this.m_Webgl.getShaderParameter(shader, this.m_Webgl.COMPILE_STATUS))
        {
          console.error('An error occurred compiling the shaders: ' + this.m_Webgl.getShaderInfoLog(shader));
          this.m_Webgl.deleteShader(shader);
          return null;
        }
        return shader;
    }

    private CreateProgram(vertexShader :WebGLShader, fragmentShader: WebGLShader) : WebGLProgram | null
    {

        const program = this.m_Webgl.createProgram();
        this.m_Webgl.attachShader(program, vertexShader);
        this.m_Webgl.attachShader(program, fragmentShader);
        this.m_Webgl.linkProgram(program);
        
        var success = this.m_Webgl.getProgramParameter(program, this.m_Webgl.LINK_STATUS);
        if (success)
        {
          return program;
        }
       
        console.log(this.m_Webgl.getProgramInfoLog(program));
        this.m_Webgl.deleteProgram(program);
        return null;
    }
}
