import { RenderCommand } from "./RenderCommand";
import { Shader } from "./Shader";
import { VertexArray } from "./VertexArray";
import { OrthographicCamera } from "./Cameras";
import { Matrix3 } from "../Math/Matrices";
import { IndexBuffer, VertexBuffer } from "./Buffers";
import { BufferElement, BufferLayout } from "./Buffers";
import { Vector3, Vector4 } from "../Math/Vectors";

export class Renderer2D
{
    private m_RenderCommand: RenderCommand; 
    private m_CurrentViewProjection: Matrix3;

    private m_QuadVAO: VertexArray | null = null;
    private m_QuadShader: Shader;
    private m_SpriteShader: Shader;

    constructor(renderCommand: RenderCommand)
    {
        this.m_RenderCommand = renderCommand;
        this.m_CurrentViewProjection = new Matrix3();
        this.m_QuadShader = new Shader(this.m_RenderCommand.GetWebGLContext());
        this.m_SpriteShader = new Shader(this.m_RenderCommand.GetWebGLContext());
        this.m_QuadShader.Init("/assest/shaders/QuadShader.vert", "/assets/shaders/QuadShader.frag");
        this.m_SpriteShader.Init("/assest/shaders/SpriteShader.vert", "/assets/shaders/SpriteShader.frag");
    }

    public BeginScene(camera: OrthographicCamera)
    {
        this.m_CurrentViewProjection = camera.GetViewProjectionMatrix();
    }

    public EndScene(){}

    public Submit(shader: Shader, vertexArray: VertexArray)
    {

        shader.Bind();
        vertexArray.Bind();

        this.m_RenderCommand.DrawIndexed(vertexArray);
    }

    public DrawQuad(position: Vector3, size: Vector3, color: Vector4): void
    {
        var modelMatrix = Matrix3.Scale(size.x, size.y).Multiply(Matrix3.Translate(position.x, position.y));
        this.m_QuadShader.Bind();
        this.m_QuadShader.SetMat4("u_ViewProjection", this.m_CurrentViewProjection.GetAll());
        this.m_QuadShader.SetMat4("u_Model", modelMatrix.GetAll());

        var quadVAO = this.GetQuadVAO();
        quadVAO.Bind();
        this.m_RenderCommand.DrawIndexed(quadVAO);
    }

    CreateQuadVAO(): VertexArray
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

        vertexBuffer.CreateBuffer(vertices);
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
