interface ShaderSources
{
  VertexShaderSource: string,
  FragmentShaderSource: string
}
class Shader
{
  private m_shaderPath: string;
  private m_shaderProgram: WebGLProgram;
  private m_shaderSources: ShaderSources
  private m_webgl: WebGLRenderingContext;

  constructor(shaderPath: string, webglContext: WebGLRenderingContext)
  {
    this.m_webgl = webglContext;
    if(!shaderPath.search(".shader"))
    {
      throw new Error("Its not a shader file..!");
    }
    this.m_shaderSources = this.ParseShader(shaderPath) as ShaderSources;
    this.m_shaderProgram = this.CreateProgram(this.m_shaderSources.VertexShaderSource, this.m_shaderSources.FragmentShaderSource) as WebGLProgram;
  }

  private CompileShader(shaderSource: string, type: number) : WebGLShader | null
  {
    const shader = this.m_webgl.createShader(type);
    if(!shader) 
    {
      console.error("Could not create a shader");
      return null;
    }
    this.m_webgl.shaderSource(shader, shaderSource);
    this.m_webgl.compileShader(shader);
    if (!this.m_webgl.getShaderParameter(shader, this.m_webgl.COMPILE_STATUS))
    {
      console.error('An error occurred compiling the shaders: ' + this.m_webgl.getShaderInfoLog(shader));
      this.m_webgl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private CreateProgram(vertexShader :WebGLShader, fragmentShader: WebGLShader) : WebGLProgram | null
  {

    const program = this.m_webgl.createProgram();
    this.m_webgl.attachShader(program, vertexShader);
    this.m_webgl.attachShader(program, fragmentShader);
    this.m_webgl.linkProgram(program);
    
    var success = this.m_webgl.getProgramParameter(program, this.m_webgl.LINK_STATUS);
    if (success)
    {
      return program;
    }
   
    console.log(this.m_webgl.getProgramInfoLog(program));
    this.m_webgl.deleteProgram(program);
    return null;
  }

  private ParseShader(shaderPath: string) : ShaderSources | null
  {
    if(true)
    {
      return { VertexShaderSource : "Bla", FragmentShaderSource : "dsaf"};
    }
       return null;
  }
}
