import { RenderCommand } from "./RenderCommand";
import { Shader } from "./Shader";
import { VertexArray } from "./VertexArray";
import { OrthographicCamera } from "./Cameras";
import { Matrix3 } from "../Math/Matrices";
import { BufferElement, BufferLayout } from "./Buffers";
import { Vector3, Vector4 } from "../Math/Vectors";
import { RendererAPI } from "./RendererAPI";
import { Texture } from "./Texture";
import { IndexBufferFactory, VertexBufferFactory } from "./BuffersFactory";
import { WebGLIndexBuffer, WebGLVertexBuffer } from "@/Platform/WebGL/WebGLBuffers";

export class Sprite
{
    public Position: Vector3;
    public Size: Vector3;
    public Color: Vector4;
    public Texture: Texture
    public UVs: Float32Array;
    constructor(texture: Texture,size: Vector3 = new Vector3(1,1,1), position: Vector3 = new Vector3(1,1,1),  color: Vector4= new Vector4(0,0,0,0)) 
    {
        this.Texture = texture;
        this.Position = position;
        this.Size = size;
        this.Color = color;
        this.UVs = new Float32Array([
            0.0, 0.0, // bot left
            1.0, 0.0, // bot right
            1.0, 1.0, // top right
            0.0, 1.0, // top left

        ])
    }
}
export class Renderer2D
{
    private m_RenderCommand: RenderCommand; 
    private m_OrthoCamera: OrthographicCamera | null = null;

    private m_QuadVAO: VertexArray | null = null;
    private m_QuadShader!: Shader;
    private m_SpriteShader!: Shader;
    
    constructor(rendererAPI: RendererAPI)
    {
        this.m_RenderCommand = new RenderCommand(rendererAPI);
    }
    Init(Shaders: {quadShader: Shader, spriteShader: Shader})
    {
        this.m_QuadShader = Shaders.quadShader;
        this.m_SpriteShader = Shaders.spriteShader; 
        this.m_QuadVAO = this.CreateQuadVAO();
    }

    public BeginScene(camera: OrthographicCamera)
    {
        this.m_OrthoCamera = camera;
    }

    public EndScene(){}

    
    public SetClearColor(color: Vector4): void
    {
        this.m_RenderCommand.ClearColor(color);
    }
    public Clear(): void
    {
        this.m_RenderCommand.Clear();
    }
    public DrawQuad(position: Vector3, size: Vector3, color: Vector4): void
    {
        if (!this.m_QuadShader) 
        {
            throw new Error("Quad shader not initialized!");
        }
        var modelMatrix = Matrix3.Translate(position.x, position.y).Multiply(Matrix3.Scale(size.x, size.y));
        this.m_QuadShader.Bind();
        const viewProjection = this.m_OrthoCamera?.GetViewProjectionMatrix().GetAll();
        this.m_QuadShader.SetMat3("u_ViewProjection", viewProjection as Float32Array)
        this.m_QuadShader.SetMat3("u_Model", modelMatrix.GetAll());
        var quadVAO = this.GetQuadVAO();
        quadVAO.Bind();
        this.m_RenderCommand.DrawIndexed(quadVAO);
    }

    public async DrawSprite(position: Vector3, size: Vector3, color: Vector4, sprite: Sprite)
    {
        
        var modelMatrix = Matrix3.Translate(position.x, position.y).Multiply(Matrix3.Scale(size.x, size.y));
        this.m_SpriteShader.Bind();
        const texture = sprite.Texture;
        texture.Bind();
        const viewProjection = this.m_OrthoCamera?.GetViewProjectionMatrix().GetAll();
        this.m_SpriteShader.SetMat3("u_ViewProjection", viewProjection as Float32Array)
        this.m_SpriteShader.SetMat3("u_Model", modelMatrix.GetAll());
        this.m_SpriteShader.SetUniform1i("u_Image", 0);
        var quadVAO = this.GetQuadVAO();
        const uvBuffer = quadVAO.GetVertexBuffers()[0]

        const vertexStride = 4 * Float32Array.BYTES_PER_ELEMENT;
        const uvOffset = 2 * Float32Array.BYTES_PER_ELEMENT;
        for(let i = 0; i < 4; i++)
        {
            const vertexOffset = i * vertexStride;
            const vertexUVOffset = vertexOffset + uvOffset; 

            uvBuffer.UpdateSubData(new Float32Array([sprite.UVs[i*2], sprite.UVs[i*2+1]]), vertexUVOffset) 
        }
        quadVAO.Bind();
        this.m_RenderCommand.DrawIndexed(quadVAO);
    }
    private CreateQuadVAO(): VertexArray
    {
        var vertices = new Float32Array([
            -0.5,  -0.5,   0.0, 0.0, // bot left
             0.5,  -0.5,   1.0, 0.0, // bot right
             0.5,   0.5,   1.0, 1.0, // top right 
            -0.5,   0.5,   0.0, 1.0, //top left
        ]);


        var indices = new Uint32Array([
            0, 1, 2,  
            0, 2, 3  
        ]); 

        const gl = this.m_RenderCommand.GetWebGLContext().GetContext() as WebGL2RenderingContext
        var vertexBuffer = VertexBufferFactory.Create(this.m_RenderCommand.GetWebGLContext()) as WebGLVertexBuffer;
        var indexBuffer =  IndexBufferFactory.Create(this.m_RenderCommand.GetWebGLContext()) as WebGLIndexBuffer;
        var vertexArray =  new VertexArray(gl);

        vertexBuffer?.Init(vertices);
        indexBuffer?.Init(indices, indices.length);
        var floatType = gl.FLOAT;
        const positionElement = new BufferElement(floatType, "position", 2);
        const texCoordsElement = new BufferElement(floatType, "texture",2);
        var bufferLayout = new BufferLayout([positionElement, texCoordsElement]);
        vertexBuffer?.SetLayout(bufferLayout);

        vertexArray.SetIndexBuffer(indexBuffer);
        vertexArray.AddVertexBuffer(vertexBuffer);
        
        return vertexArray;
    }
    private GetQuadVAO(): VertexArray
    {
        if(!this.m_QuadVAO)
        {
            this.m_QuadVAO = this.CreateQuadVAO();
        }
        return this.m_QuadVAO;
    }
}
