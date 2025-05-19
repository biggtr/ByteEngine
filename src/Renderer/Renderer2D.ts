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
import { BindGroup, RESOURCE_TYPE, SHADER_TYPE } from "./BindGroup";
import { BindGroupFactory } from "./BindGroupFactory";
import { RenderPipelineFactory } from "./RenderPipelineFactory";

const uniformLayout = new BufferLayout([
            {type: SHADER_DATA_TYPE.MAT4, name:"viewProjection"},
            {type: SHADER_DATA_TYPE.MAT4, name:"modelMatrix"}
        ])
        
var uniformData = new Float32Array(uniformLayout.GetStride() / 4);

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
        this.m_RenderCommand.BeginScene();
    }

    public EndScene()
    {
        this.m_RenderCommand.EndScene();
    }

    
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
        
        var modelMatrix = Matrix4.Translate(position.x, position.y, position.z).Multiply(Matrix4.Scale(size.x, size.y, size.z));
        const viewProjection = this.m_OrthoCamera.GetViewProjectionMatrix().m_Data;

        uniformData.set(viewProjection, uniformLayout.m_BufferLayoutElements[0].Offset + uniformLayout.m_BufferLayoutElements[0].Padding);
        uniformData.set(modelMatrix.m_Data, uniformLayout.m_BufferLayoutElements[1].Offset+ uniformLayout.m_BufferLayoutElements[1].Padding);
        var uniformBuffer = BufferFactory.Create(uniformData, BUFFER_TYPE.UNIFORM)
        uniformBuffer.SetLayout(uniformLayout);
        uniformBuffer.Upload()
        
        const bindGroup = BindGroupFactory.Create();
        bindGroup.AddGroupLayout([
            { Name: "Transforms", Binding: 0, Visibility: SHADER_TYPE.VERTEX, ResourceType:RESOURCE_TYPE.BUFFER, Data: uniformBuffer},
        ])
        
        var quadGeometry = this.GetQuadGeometry();
        const pipeline = RenderPipelineFactory.Create(quadGeometry, this.m_QuadShader, bindGroup);
        this.m_RenderCommand.DrawIndexed(pipeline); 
    }

    public async DrawSprite(position: Vector3, size: Vector3, color: Vector4, sprite: Sprite)
    {
        
        var modelMatrix = Matrix4.Translate(position.x, position.y, position.z).Multiply(Matrix4.Scale(size.x, size.y, size.z));
        const texture = sprite.Texture;
        const viewProjection = this.m_OrthoCamera.GetViewProjectionMatrix().m_Data; 
        
        uniformData.set(viewProjection, uniformLayout.m_BufferLayoutElements[0].Offset + uniformLayout.m_BufferLayoutElements[0].Padding);
        uniformData.set(modelMatrix.m_Data, uniformLayout.m_BufferLayoutElements[1].Offset + uniformLayout.m_BufferLayoutElements[1].Padding);
        var uniformBuffer = BufferFactory.Create(uniformData, BUFFER_TYPE.UNIFORM)
        uniformBuffer.SetLayout(uniformLayout);
        uniformBuffer.Upload();
        
        const bindGroup = BindGroupFactory.Create();
        bindGroup.AddGroupLayout([
            { Name: "Transforms", Binding: 0, Visibility: SHADER_TYPE.VERTEX, ResourceType:RESOURCE_TYPE.BUFFER, Data: uniformBuffer},
            { Name: "u_Image", Binding: 1, Visibility: SHADER_TYPE.FRAGMENT, ResourceType:RESOURCE_TYPE.SAMPLER, Data: texture },
            { Name: "texture", Binding: 2, Visibility: SHADER_TYPE.FRAGMENT, ResourceType:RESOURCE_TYPE.TEXTURE, Data: texture },
        ])
        
        var quadGeometry = this.GetQuadGeometry();
        const uvBuffer = quadGeometry.GetVertexBuffers()[0]

        const vertexStride = 4 * Float32Array.BYTES_PER_ELEMENT;
        const uvOffset = 2 * Float32Array.BYTES_PER_ELEMENT;
        for(let i = 0; i < 4; i++)
        {
            const vertexOffset = i * vertexStride;
            const vertexUVOffset = vertexOffset + uvOffset; 

            uvBuffer.UpdateSubData(new Float32Array([sprite.UVs[i*2], sprite.UVs[i*2+1]]), vertexUVOffset) 
        }
        const pipeline = RenderPipelineFactory.Create(quadGeometry, this.m_SpriteShader, bindGroup);

        this.m_RenderCommand.DrawIndexed(pipeline);
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
        vertexBuffer.Upload();
        vertexBuffer.SetLayout(bufferLayout);


        indexBuffer.Upload();
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
