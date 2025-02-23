export class Shader
{
    private m_shaderProgram: WebGLProgram | null = null;
    private m_Webgl: WebGL2RenderingContext;

    constructor(webgl: WebGL2RenderingContext)
    {
      this.m_Webgl = webgl;
    }
    public async Init(vertexShaderPath: string,fragmentShaderPath:string)
    {
      const {vertexShader, fragmentShader} = await this.ParseShader(vertexShaderPath, fragmentShaderPath);
      this.m_shaderProgram = this.CreateProgram(vertexShader, fragmentShader) as WebGLProgram;

    }
    public Bind()
    {
      this.m_Webgl.useProgram(this.m_shaderProgram);
    }
    public UnBind()
    {
      this.m_Webgl.deleteProgram(this.m_shaderProgram);
    }
    public GetAttributeLocation(attributeName: string) : GLint
    {
      return this.m_Webgl.getAttribLocation(this.m_shaderProgram as WebGLProgram, attributeName);
    }

    public GetUniformLocation(uniformName: string) : WebGLUniformLocation | null
    {
        return this.m_Webgl.getUniformLocation(this.m_shaderProgram as WebGLProgram, uniformName);
    }
    public SetMat3(uniformName: string, data: Float32Array): void
    {
        const location = this.m_Webgl.getUniformLocation(this.m_shaderProgram as WebGLProgram, uniformName);
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

    private async LoadShaderSources(shaderPath: string): Promise<string> 
    {
        try {
            const response = await fetch(shaderPath);
            if (!response.ok) {
                throw new Error(`Error reading shader file at ${shaderPath}: ${response.statusText}`);
            }
            return await response.text();
        } catch (err) {
            throw new Error(`Error reading shader file at ${shaderPath}: ${err}`);
        }
    }
    private async ParseShader(vertexShaderPath: string, fragmentShaderPath: string) : Promise<{vertexShader: WebGLShader, fragmentShader: WebGLShader}>
    {
      const VertexShaderSource = await this.LoadShaderSources(vertexShaderPath);
      const FragmentShaderSource = await this.LoadShaderSources(fragmentShaderPath);

      const vertexShader =  this.CompileShader(VertexShaderSource, this.m_Webgl.VERTEX_SHADER) as WebGLShader;
      const fragmentShader =  this.CompileShader(FragmentShaderSource, this.m_Webgl.FRAGMENT_SHADER) as WebGLShader;
      return {vertexShader, fragmentShader};
    }
}
