import { RenderCommand } from "./RenderCommand";
import { Shader } from "./Shader";
import { VertexArray } from "./VertexArray";
import { OrthographicCamera } from "./Cameras";
import { Matrix3 } from "../Math/Matrices";
import { IndexBuffer, VertexBuffer } from "./Buffers";
import { BufferElement, BufferLayout } from "./Buffers";
import { Vector3, Vector4 } from "../Math/Vectors";
import { RendererAPI } from "./RendererAPI";
import { Texture } from "./Texture";

export class Renderer2D
{
    private m_RenderCommand: RenderCommand; 
    private m_OrthoCamera: OrthographicCamera | null = null;

    private m_QuadVAO: VertexArray | null = null;
    private m_QuadShader: Shader;
    private m_SpriteShader: Shader;
    
    constructor(rendererAPI: RendererAPI)
    {
        this.m_RenderCommand = new RenderCommand(rendererAPI);
        this.m_QuadShader = new Shader(this.m_RenderCommand.GetWebGLContext());
        this.m_SpriteShader = new Shader(this.m_RenderCommand.GetWebGLContext());
    }
    async Init()
    {
        await this.m_QuadShader.Create("/assets/shaders/QuadShader.vert", "/assets/shaders/QuadShader.frag");
        await this.m_SpriteShader.Create("/assets/shaders/SpriteShader.vert", "/assets/shaders/SpriteShader.frag");
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
        var modelMatrix = Matrix3.Translate(position.x, position.y).Multiply(Matrix3.Scale(size.x, size.y));
        this.m_QuadShader.Bind();
        const viewProjection = this.m_OrthoCamera?.GetViewProjectionMatrix().GetAll();
        this.m_QuadShader.SetMat3("u_ViewProjection", viewProjection as Float32Array)
        this.m_QuadShader.SetMat3("u_Model", modelMatrix.GetAll());
        var quadVAO = this.GetQuadVAO();
        quadVAO.Bind();
        this.m_RenderCommand.DrawIndexed(quadVAO);
    }

    public async DrawSprite(position: Vector3, size: Vector3, color: Vector4, texture: Texture)
    {
        
        var modelMatrix = Matrix3.Translate(position.x, position.y).Multiply(Matrix3.Scale(size.x, size.y));
        this.m_SpriteShader.Bind();
        texture.Bind();
        const viewProjection = this.m_OrthoCamera?.GetViewProjectionMatrix().GetAll();
        this.m_SpriteShader.SetMat3("u_ViewProjection", viewProjection as Float32Array)
        this.m_SpriteShader.SetMat3("u_Model", modelMatrix.GetAll());
        this.m_SpriteShader.SetUniform1i("u_Image", 0);
        var quadVAO = this.GetQuadVAO();
        quadVAO.Bind();
        this.m_RenderCommand.DrawIndexed(quadVAO);
    }
    private CreateQuadVAO(): VertexArray
    {
        var vertices = new Float32Array([
            -0.5,   0.5,   0.0, 1.0, 
            -0.5,  -0.5,   0.0, 0.0, 
             0.5,  -0.5,   1.0, 0.0, 
             0.5,   0.5,   1.0, 1.0, 
        ]);


        var indices = new Uint32Array([
            0, 1, 2,  
            0, 2, 3  
        ]); 

        var vertexBuffer = new VertexBuffer(this.m_RenderCommand.GetWebGLContext());
        var indexBuffer = new IndexBuffer(this.m_RenderCommand.GetWebGLContext());
        var vertexArray = new VertexArray(this.m_RenderCommand.GetWebGLContext());

        vertexBuffer.Create(vertices);
        indexBuffer.Create(indices, indices.length);
        var floatType = this.m_RenderCommand.GetWebGLContext().FLOAT;
        const positionElement = new BufferElement(floatType, "position", 2);
        const texCoordsElement = new BufferElement(floatType, "texture",2);
        var bufferLayout = new BufferLayout([positionElement, texCoordsElement]);
        vertexBuffer.SetLayout(bufferLayout);

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
