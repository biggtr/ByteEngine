import { Shader } from "@/Renderer/Shader";

export interface SHADER_SOURCE
{
    VERTEX: string;
    FRAGMENT: string;
}
export class WebGlShader extends Shader
{
    private m_ShaderProgram: WebGLProgram | null = null;
    private m_Webgl: WebGL2RenderingContext;

    constructor(webgl: WebGL2RenderingContext)
    {
      super()
      this.m_Webgl = webgl;
    }
    public Init(shaderSources: SHADER_SOURCE)
    {
      const vertexShader = this.CompileShader(shaderSources.VERTEX, this.m_Webgl.VERTEX_SHADER) as WebGLShader;
      const fragmentShader = this.CompileShader(shaderSources.FRAGMENT, this.m_Webgl.FRAGMENT_SHADER) as WebGLShader;
      this.m_ShaderProgram = this.CreateProgram(vertexShader, fragmentShader) as WebGLProgram;
      

    }
    public Bind()
    {
      this.m_Webgl.useProgram(this.m_ShaderProgram);
    }

    public UnBind()
    {
      this.m_Webgl.deleteProgram(this.m_ShaderProgram);
    }

    public GetAttributeLocation(attributeName: string) : GLint
    {
      return this.m_Webgl.getAttribLocation(this.m_ShaderProgram as WebGLProgram, attributeName);
    }

    public GetUniformLocation(uniformName: string) : WebGLUniformLocation | null
    {
        return this.m_Webgl.getUniformLocation(this.m_ShaderProgram as WebGLProgram, uniformName);
    }
    public SetUniform1i(uniformName: string, data: number)
    {
        const location = this.m_Webgl.getUniformLocation(this.m_ShaderProgram as WebGLProgram, uniformName);
        this.m_Webgl.uniform1i(location, data);
    }
    public SetMat3(uniformName: string, data: Float32Array): void
    {
        const location = this.m_Webgl.getUniformLocation(this.m_ShaderProgram as WebGLProgram, uniformName);
        this.m_Webgl.uniformMatrix3fv(location,false, data);
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
