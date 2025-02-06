import { Shader } from "./Renderer/Shader"; 
import { WebGLContext } from "./Renderer/WebGLContext"; 
import { VertexBuffer }  from "./Renderer/Buffers"
import { Texture } from "./Renderer/Texture";

async function main()
{

    console.log("entry point ..")
    const webglContext = new WebGLContext("glcanvas")
    const webgl = webglContext.GetWebGL();
    const ourShader = new Shader(webgl);
    await ourShader.Init("/assets/shaders/texture.vert", "/assets/shaders/texture.frag");


    var positions = new Float32Array([
        -0.5,  0.5,  
        -0.5, -0.5,        
        0.5, -0.5, 
        -0.5,  0.5, 
         0.5, -0.5, 
         0.5,  0.5  
    ]);

    var texCoords = new Float32Array([
        0.0,  1.0,  
        0.0,  0.0,  
        1.0,  0.0,  
        0.0,  1.0,  
        1.0,  0.0,  
        1.0,  1.0   
    ]);
        

    const PositionBuffer = new VertexBuffer(webgl);
    PositionBuffer.CreateBuffer(positions)
    var positionAttributeLocation = ourShader.GetAttributeLocation("a_position");

    var VAO = webgl.createVertexArray();
    webgl.bindVertexArray(VAO);
    webgl.enableVertexAttribArray(positionAttributeLocation);
    var size = 2;          
    var type = webgl.FLOAT;
    var normalize = false; 
    var stride = 0;       
    var offset = 0;      
    webgl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset)

    const texCoordBuffer = new VertexBuffer(webgl);
    texCoordBuffer.CreateBuffer(texCoords);
    var texCoordAtrributeLocation = ourShader.GetAttributeLocation("a_texCoord")
    webgl.enableVertexAttribArray(texCoordAtrributeLocation);
    webgl.vertexAttribPointer(texCoordAtrributeLocation, size, type, normalize, stride, offset);

    var imageLocation = ourShader.GetUniformLocation("u_image");
    
    var texture = new Texture(webgl);
    await texture.CreateTexture("/assets/textures/basic.png")
    texture.Bind(0);

    webgl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
    webgl.clearColor(0, 0, 0, 0);
    webgl.clear(webgl.COLOR_BUFFER_BIT);

    webgl.bindVertexArray(VAO);
    ourShader.Bind();
    webgl.uniform1i(imageLocation, 0);

    var primitiveType = webgl.TRIANGLES;
    var offset = 0;
    var count = 6;
    webgl.drawArrays(primitiveType, offset, count);

}
main()
