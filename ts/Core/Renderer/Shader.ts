import * as fs from 'fs';
class Shader
{
  private m_shaderProgram: WebGLProgram;
  private m_webgl: WebGLRenderingContext;

  constructor(vertexShaderPath: string,fragmentShaderPath:string, webglContext: WebGLRenderingContext)
  {
    this.m_webgl = webglContext;
    const {vertexShader, fragmentShader} = this.ParseShader(vertexShaderPath, fragmentShaderPath);
    this.m_shaderProgram = this.CreateProgram(vertexShader, fragmentShader) as WebGLProgram;
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

  private LoadShaderSources(shaderPath: string): string 
  {
    try {
        const data = fs.readFileSync(shaderPath, "utf8");
        return data;
    }catch (err) {
        throw new Error(`Error reading shader file at ${shaderPath}: ${err}`);
    }
  }  
  private ParseShader(vertexShaderPath: string, fragmentShaderPath: string) : {vertexShader: WebGLShader, fragmentShader: WebGLShader}
  {
    const VertexShaderSource = this.LoadShaderSources(vertexShaderPath);
    const FragmentShaderSource = this.LoadShaderSources(fragmentShaderPath);

    const vertexShader =  this.CompileShader(VertexShaderSource, this.m_webgl.VERTEX_SHADER) as WebGLShader;
    const fragmentShader =  this.CompileShader(FragmentShaderSource, this.m_webgl.FRAGMENT_SHADER) as WebGLShader;
    return {vertexShader, fragmentShader};
  }
}
