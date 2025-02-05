export class Shader
{
  private m_shaderProgram: WebGLProgram | null = null;
  private m_webgl: WebGLRenderingContext;

  constructor(webglContext: WebGLRenderingContext)
  {
    this.m_webgl = webglContext;
  }
  public async Init(vertexShaderPath: string,fragmentShaderPath:string)
  {
    const {vertexShader, fragmentShader} = await this.ParseShader(vertexShaderPath, fragmentShaderPath);
    this.m_shaderProgram = this.CreateProgram(vertexShader, fragmentShader) as WebGLProgram;

  }
  public Bind()
  {
    this.m_webgl.useProgram(this.m_shaderProgram);
  }
  public UnBind()
  {
    this.m_webgl.deleteProgram(this.m_shaderProgram);
  }
  public GetAttributeLocation(attributeName: string) : GLint
  {
    return this.m_webgl.getAttribLocation(this.m_shaderProgram as WebGLProgram, attributeName);
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

    const vertexShader =  this.CompileShader(VertexShaderSource, this.m_webgl.VERTEX_SHADER) as WebGLShader;
    const fragmentShader =  this.CompileShader(FragmentShaderSource, this.m_webgl.FRAGMENT_SHADER) as WebGLShader;
    return {vertexShader, fragmentShader};
  }
}
