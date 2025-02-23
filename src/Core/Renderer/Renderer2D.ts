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

    constructor(renderCommand: RenderCommand)
    {
        this.m_RenderCommand = renderCommand;
        this.m_CurrentViewProjection = new Matrix3();
        this.m_QuadShader = new Shader(this.m_RenderCommand.GetWebGLContext());
    }
    async Init()
    {
        await this.m_QuadShader.Init("/assets/shaders/QuadShader.vert", "/assets/shaders/QuadShader.frag");
    }

    public BeginScene(camera: OrthographicCamera)
    {
        this.m_CurrentViewProjection = camera.GetViewProjectionMatrix();
    }

    public EndScene(){}

    

    public DrawQuad(position: Vector3, size: Vector3, color: Vector4): void
    {
        var modelMatrix = Matrix3.Scale(size.x, size.y).Multiply(Matrix3.Translate(position.x, position.y));
        this.m_QuadShader.Bind();
        this.m_QuadShader.SetMat3("u_ViewProjection", this.m_CurrentViewProjection.GetAll());
        this.m_QuadShader.SetMat3("u_Model", modelMatrix.GetAll());
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
