import { RenderCommand } from "./RenderCommand";
import { Shader } from "./Shader";
import { Geometry } from "./Geometry";
import { OrthographicCamera } from "./Cameras";
import { Matrix3, Matrix4 } from "../Math/Matrices";
import { AlignTo16, BUFFER_TYPE, BufferElement, BufferLayout, SHADER_DATA_TYPE } from "./Buffers";
import { Vector3, Vector4 } from "../Math/Vectors";
import { RendererAPI } from "./RendererAPI";
import { Texture } from "./Texture";
import { IndexBufferFactory, BufferFactory } from "./BuffersFactory";
import { GeometryFactory } from "./GeometryFactory";
import { context } from "@/Core/Byte";

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
    private m_OrthoCamera!: OrthographicCamera; 

    private m_QuadGeometry: Geometry | null = null;
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
        this.m_QuadGeometry = this.CreateQuadGeometry();
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
        this.m_QuadShader.Upload();
        const viewProjection = this.m_OrthoCamera.GetViewProjectionMatrix().m_Data;

        this.m_QuadShader.SetMat3("u_ViewProjection", viewProjection as Float32Array)
        this.m_QuadShader.SetMat3("u_Model", modelMatrix.GetAll());
        var quadVAO = this.GetQuadGeometry();
        quadVAO.Upload();
        this.m_RenderCommand.DrawIndexed(quadVAO);
    }

    public async DrawSprite(position: Vector3, size: Vector3, color: Vector4, sprite: Sprite)
    {
        
        var modelMatrix = Matrix4.Translate(position.x, position.y, position.z).Multiply(Matrix4.Scale(size.x, size.y, size.z));
        this.m_SpriteShader.Upload();
        const texture = sprite.Texture;
        texture.Upload();
        const viewProjection = this.m_OrthoCamera.GetViewProjectionMatrix().m_Data as Float32Array;
        this.m_SpriteShader.SetMat4("u_ViewProjection", viewProjection)
        this.m_SpriteShader.SetMat4("u_Model", modelMatrix.m_Data);
        this.m_SpriteShader.SetUniform1i("u_Image", 0);
        var quadVAO = this.GetQuadGeometry();
        const uvBuffer = quadVAO.GetVertexBuffers()[0]

        const vertexStride = 4 * Float32Array.BYTES_PER_ELEMENT;
        const uvOffset = 2 * Float32Array.BYTES_PER_ELEMENT;
        for(let i = 0; i < 4; i++)
        {
            const vertexOffset = i * vertexStride;
            const vertexUVOffset = vertexOffset + uvOffset; 

            uvBuffer.UpdateSubData(new Float32Array([sprite.UVs[i*2], sprite.UVs[i*2+1]]), vertexUVOffset) 
        }
        quadVAO.Upload();
        this.m_RenderCommand.DrawIndexed(quadVAO);
    }
    private CreateQuadGeometry(): Geometry
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

        
        var vertexBuffer = BufferFactory.Create(vertices, BUFFER_TYPE.VERTEX); 
        var indexBuffer =  IndexBufferFactory.Create(indices, indices.length); 
        var geometry =  GeometryFactory.Create();

        var bufferLayout = new BufferLayout([
            {type: SHADER_DATA_TYPE.FLOAT2, name: "position"},
            {type: SHADER_DATA_TYPE.FLOAT2, name: "texture"}
        ]);
        vertexBuffer.SetLayout(bufferLayout);

        geometry.SetIndexBuffer(indexBuffer);
        geometry.AddVertexBuffer(vertexBuffer);
        
        return geometry;
    }
    private GetQuadGeometry(): Geometry
    {
        if(!this.m_QuadGeometry)
        {
            this.m_QuadGeometry = this.CreateQuadGeometry();
        }
        return this.m_QuadGeometry;
    }
}
