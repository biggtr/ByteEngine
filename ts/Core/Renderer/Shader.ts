
function CompileShader(gl: WebGLRenderingContext, shaderSource: string, type: number) : WebGLShader | null
{
  const shader = gl.createShader(type);
  if(!shader) 
  {
    console.error("Could not create a shader");
    return null;
  }
  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
  {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function CreateProgram(gl :WebGLRenderingContext, vertexShader :WebGLShader, fragmentShader: WebGLShader) : WebGLProgram | null
{

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success)
  {
    return program;
  }
 
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}
