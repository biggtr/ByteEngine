import { RenderCommand } from "./RenderCommand";
import { Shader, SHADER_SOURCE } from "./Shader";
import { Geometry } from "./Geometry";
import { OrthographicCamera } from "./Cameras";
import {  Matrix4 } from "../Math/Matrices";
import { Buffer, BUFFER_TYPE,  BufferLayout, GetShaderDataTypeSize, SHADER_DATA_TYPE } from "./Buffers";
import { Vector2, Vector3, Vector4 } from "../Math/Vectors";
import { RendererAPI } from "./RendererAPI";
import { Texture } from "./Texture";
import { IndexBufferFactory, BufferFactory } from "./BuffersFactory";
import { GeometryFactory } from "./GeometryFactory";
import {  RESOURCE_TYPE, SHADER_TYPE } from "./BindGroup";
import { BindGroupFactory } from "./BindGroupFactory";
import { RenderPipelineFactory } from "./RenderPipelineFactory";
import { CSprite } from "@/Scene/Components";
import { ShaderFactory } from "./ShaderFactory";
import { HANDLER_TYPE } from "@/ResourceManagement/ResourceManager";

export enum SPRITE_TYPE
{
    STATIC,
    DYNAMIC
}

interface QuadVertex
{
    Position: Vector4;
    Color: Vector4;
    TextureCoords: Vector2;
    TexId: number;
}

const uniformLayout = new BufferLayout([
            {type: SHADER_DATA_TYPE.MAT4, name:"viewProjection"},
            {type: SHADER_DATA_TYPE.MAT4, name:"modelMatrix"},
            {type: SHADER_DATA_TYPE.FLOAT4, name: "color" },        
        ])
        
var uniformData = new Float32Array(uniformLayout.GetStride() / 4);
console.log(`uniform layout stride ${uniformLayout.GetStride()}`)

export class Renderer2D
{
    private m_RenderCommand: RenderCommand; 
    private m_OrthoCamera?: OrthographicCamera; 

    static MaxQuads = 100000;
    static MaxVertices = Renderer2D.MaxQuads * 4;
    static MaxIndices = Renderer2D.MaxQuads * 6;
    static MaxTextureSlots = 16;

    


    private QuadVertexArray!: Geometry;
    private QuadVertexBuffer!: Buffer;
    private SolidQuadVertexArray!: Geometry;
    private SolidQuadVertexBuffer!: Buffer;
    private QuadShader!: Shader;
    private SpriteShader!: Shader;
    
    private QuadIndexCount = 0;
    private QuadVertexBufferBase!: Float32Array; 
    private QuadVertexBufferPtr = 0;
    private TextureSlots: Texture[] = [];
    private TextureSlotIndex = 0;

    private SolidQuadIndexCount = 0;
    private SolidQuadVertexBufferBase!: Float32Array;
    private SolidQuadVertexBufferPtr = 0;

    private Stats = {
        DrawCalls: 0,
        QuadCount: 0,
        TexturedQuadCount: 0,
        SolidQuadCount: 0
    };
    constructor(rendererAPI: RendererAPI)
    {
        this.m_RenderCommand = new RenderCommand(rendererAPI);
    }
    public async Init()
    {
        this.QuadVertexBufferBase = new Float32Array(Renderer2D.MaxVertices * 10);
        this.SolidQuadVertexBufferBase = new Float32Array(Renderer2D.MaxVertices * 7); 
        const quadShaderSources  = await this.LoadShaderFromFile("/assets/shaders/Quad.glsl");
        const spriteShaderSources  = await this.LoadShaderFromFile("/assets/shaders/Sprite.glsl");
        this.QuadShader = ShaderFactory.Create(quadShaderSources);
        this.SpriteShader = ShaderFactory.Create(spriteShaderSources);
        this.TextureSlots = [];
        this.QuadVertexArray = GeometryFactory.Create();
        this.QuadVertexBuffer = BufferFactory.Create(this.QuadVertexBufferBase, BUFFER_TYPE.VERTEX);
        const quadLayout = new BufferLayout([
            { type: SHADER_DATA_TYPE.FLOAT3, name: "a_Position" },
            { type: SHADER_DATA_TYPE.FLOAT4, name: "a_Color" },
            { type: SHADER_DATA_TYPE.FLOAT2, name: "a_TexCoords" },
            { type: SHADER_DATA_TYPE.FLOAT, name: "a_TexIndex" }
        ]);
        this.QuadVertexBuffer.SetLayout(quadLayout);
        this.QuadVertexArray.AddVertexBuffer(this.QuadVertexBuffer);

        this.SolidQuadVertexArray = GeometryFactory.Create();
        this.SolidQuadVertexBuffer = BufferFactory.Create(this.SolidQuadVertexBufferBase, BUFFER_TYPE.VERTEX);
        const solidQuadLayout = new BufferLayout([
            { type: SHADER_DATA_TYPE.FLOAT3, name: "a_Position" },
            { type: SHADER_DATA_TYPE.FLOAT4, name: "a_Color" }
        ]);
        this.SolidQuadVertexBuffer.SetLayout(solidQuadLayout);
        this.SolidQuadVertexArray.AddVertexBuffer(this.SolidQuadVertexBuffer);

        const quadIndices = new Uint32Array(Renderer2D.MaxIndices);
        let offset = 0;
        for (let i = 0; i < Renderer2D.MaxIndices; i += 6) 
        {
            quadIndices[i + 0] = offset + 0;
            quadIndices[i + 1] = offset + 1;
            quadIndices[i + 2] = offset + 2;

            quadIndices[i + 3] = offset + 2;
            quadIndices[i + 4] = offset + 3;
            quadIndices[i + 5] = offset + 0;
            offset += 4;
        }
        const QuadIBO = IndexBufferFactory.Create(quadIndices, Renderer2D.MaxIndices);
        this.QuadVertexArray.SetIndexBuffer(QuadIBO);

        const SolidQuadIBO = IndexBufferFactory.Create(quadIndices, Renderer2D.MaxIndices);
        this.SolidQuadVertexArray.SetIndexBuffer(SolidQuadIBO);

        this.QuadShader.Upload();
        this.SpriteShader.Upload();
        this.ResetBatch();
    }

    private async LoadShaderFromFile(path: string): Promise<SHADER_SOURCE>
    {
        const response = await fetch(path);
        const content = await response.text();
        return this.ParseShaderContent(content);
    }


    private ParseShaderContent(content: string): SHADER_SOURCE 
    {

        let vertex = "";

        let fragment = "";
        let current: "vertex" | "fragment" | null = null;

        content.split('\n').forEach(line => {
            if(line.includes('#Vertex'))
            {
                current = 'vertex';
                return;
            }

        
          
            else if(line.includes('#Fragment'))
            {
                current = 'fragment';
                return; 
            }
            else if(current === 'vertex') vertex += line + '\n';
            else if(current === 'fragment') fragment += line + '\n';
        });

        return { VERTEX: vertex, FRAGMENT: fragment };
  }
    private ResetBatch(): void
    {
        this.QuadIndexCount = 0;
        this.QuadVertexBufferPtr = 0;
        this.SolidQuadIndexCount = 0;
        this.SolidQuadVertexBufferPtr = 0;
        this.TextureSlotIndex = 0;
        this.TextureSlots = [];
    }
    public BeginScene(camera: OrthographicCamera): void
    {
        this.m_OrthoCamera = camera;
        this.ResetBatch();
        this.Stats.DrawCalls = 0;
        this.Stats.QuadCount = 0;
        this.Stats.TexturedQuadCount = 0;
        this.Stats.SolidQuadCount = 0;
    }
    public EndScene(): void
    {
        this.FlushSolidQuads();
        this.FlushTexturedQuads();
    }
    private FlushSolidQuads(): void
    {
        if (this.SolidQuadIndexCount === 0) return;

        const dataSize = this.SolidQuadVertexBufferPtr;
        const dataToUpload = this.SolidQuadVertexBufferBase.slice(0, dataSize);
        this.SolidQuadVertexBuffer.SetData(dataToUpload);

        const camera = this.m_OrthoCamera!;
        const viewProjection = camera.GetViewProjectionMatrix();
        const modelMatrix = Matrix4.Identity();

        uniformData.set(viewProjection.m_Data, 0);
        uniformData.set(modelMatrix.m_Data, 16);
        uniformData.set([1, 1, 1, 1], 32); 

        const uniformBuffer = BufferFactory.Create(uniformData, BUFFER_TYPE.UNIFORM);
        uniformBuffer.SetLayout(uniformLayout);
        uniformBuffer.Upload();

        const bindGroup = BindGroupFactory.Create();
        bindGroup.AddGroupLayout([
            { Name: "Transforms", Binding: 0, Visibility: SHADER_TYPE.VERTEX, ResourceType: RESOURCE_TYPE.BUFFER, Data: uniformBuffer }
        ]);

        const pipeline = RenderPipelineFactory.Create(this.SolidQuadVertexArray, this.QuadShader, bindGroup);
        this.m_RenderCommand.DrawIndexed(pipeline, this.SolidQuadIndexCount);

        this.Stats.DrawCalls++;
        this.Stats.SolidQuadCount += this.SolidQuadIndexCount / 6;

        this.SolidQuadIndexCount = 0;
        this.SolidQuadVertexBufferPtr = 0;
    }
    private FlushTexturedQuads(): void
    {
        if (this.QuadIndexCount === 0) return;

        const dataSize = this.QuadVertexBufferPtr;
        const dataToUpload = this.QuadVertexBufferBase.slice(0, dataSize);
        this.QuadVertexBuffer.SetData(dataToUpload);

        const camera = this.m_OrthoCamera!;
        const viewProjection = camera.GetViewProjectionMatrix();
        const modelMatrix = Matrix4.Identity();

        uniformData.set(viewProjection.m_Data, 0);
        uniformData.set(modelMatrix.m_Data, 16);
        uniformData.set([1, 1, 1, 1], 32);

        const uniformBuffer = BufferFactory.Create(uniformData, BUFFER_TYPE.UNIFORM);
        uniformBuffer.SetLayout(uniformLayout);
        uniformBuffer.Upload();

        const bindGroup = BindGroupFactory.Create();
        const bindGroupLayout = [
            { Name: "Transforms", Binding: 0, Visibility: SHADER_TYPE.VERTEX, ResourceType: RESOURCE_TYPE.BUFFER, Data: uniformBuffer },
        { Name: "u_Textures", Binding: 1, Visibility: SHADER_TYPE.FRAGMENT, ResourceType: RESOURCE_TYPE.TEXTURE_ARRAY, Data: this.TextureSlots }
        ];

        for (let i = 0; i < this.TextureSlots.length; i++) {
            bindGroupLayout.push(
                { Name: `u_Textures[${i}]`, Binding: i + 1, Visibility: SHADER_TYPE.FRAGMENT, ResourceType: RESOURCE_TYPE.TEXTURE, Data: this.TextureSlots[i] }
            );
        }

        bindGroup.AddGroupLayout(bindGroupLayout);

        const pipeline = RenderPipelineFactory.Create(this.QuadVertexArray, this.SpriteShader, bindGroup);
        this.m_RenderCommand.DrawIndexed(pipeline, this.QuadIndexCount);

        this.Stats.DrawCalls++;
        this.Stats.TexturedQuadCount += this.QuadIndexCount / 6;

        this.QuadIndexCount = 0;
        this.QuadVertexBufferPtr = 0;
        this.TextureSlotIndex = 0;
        this.TextureSlots = [];
    }   
    private FlushTexturedBatchIfNeeded(): void
    {
        if (this.QuadIndexCount >= Renderer2D.MaxIndices) {
            this.FlushTexturedQuads();
        }
    }

    private FlushSolidBatchIfNeeded(): void
    {
        if (this.SolidQuadIndexCount >= Renderer2D.MaxIndices) {
            this.FlushSolidQuads();
        }
    }
    public SetClearColor(color: Vector4): void
    {
        this.m_RenderCommand.ClearColor(color);
    }
    public Clear(): void
    {
        this.m_RenderCommand.Clear();
    }
    public DrawQuad(position: Vector3, size: Vector3, color: Vector4, renderType: SPRITE_TYPE = SPRITE_TYPE.DYNAMIC): void
    {
        this.FlushSolidBatchIfNeeded();

        const halfSize = Vector3.Multiply(size, 0.5);
        const vertices = [
            new Vector3(position.x - halfSize.x, position.y - halfSize.y, position.z),
            new Vector3(position.x + halfSize.x, position.y - halfSize.y, position.z),
            new Vector3(position.x + halfSize.x, position.y + halfSize.y, position.z),
            new Vector3(position.x - halfSize.x, position.y + halfSize.y, position.z)
        ];

        for (let i = 0; i < 4; i++) {
            this.SolidQuadVertexBufferBase[this.SolidQuadVertexBufferPtr++] = vertices[i].x;
            this.SolidQuadVertexBufferBase[this.SolidQuadVertexBufferPtr++] = vertices[i].y;
            this.SolidQuadVertexBufferBase[this.SolidQuadVertexBufferPtr++] = vertices[i].z;

            this.SolidQuadVertexBufferBase[this.SolidQuadVertexBufferPtr++] = color.x;
            this.SolidQuadVertexBufferBase[this.SolidQuadVertexBufferPtr++] = color.y;
            this.SolidQuadVertexBufferBase[this.SolidQuadVertexBufferPtr++] = color.z;
            this.SolidQuadVertexBufferBase[this.SolidQuadVertexBufferPtr++] = color.w;
        }

        this.SolidQuadIndexCount += 6;
    }

    public DrawSprite(position: Vector3, size: Vector3, color: Vector4, sprite: CSprite, renderType: SPRITE_TYPE = SPRITE_TYPE.DYNAMIC): void
    {
        this.FlushTexturedBatchIfNeeded();

        let textureIndex = -1;
        for (let i = 0; i < this.TextureSlots.length; i++) {
            if (this.TextureSlots[i] === sprite.Texture) {
                textureIndex = i;
                break;
            }
        }

        if (textureIndex === -1) {
            if (this.TextureSlotIndex >= Renderer2D.MaxTextureSlots) {
                this.FlushTexturedQuads();
            }

            textureIndex = this.TextureSlotIndex;
            this.TextureSlots.push(sprite.Texture);
            this.TextureSlotIndex++;
        }

        const halfSize = Vector3.Multiply(size, 0.5);
        const vertices = [
            new Vector3(position.x - halfSize.x, position.y - halfSize.y, position.z),
            new Vector3(position.x + halfSize.x, position.y - halfSize.y, position.z),
            new Vector3(position.x + halfSize.x, position.y + halfSize.y, position.z),
            new Vector3(position.x - halfSize.x, position.y + halfSize.y, position.z)
        ];

        const textureCoords = [
            new Vector2(sprite.UVs[0], sprite.UVs[1]),
            new Vector2(sprite.UVs[2], sprite.UVs[3]),
            new Vector2(sprite.UVs[4], sprite.UVs[5]),
            new Vector2(sprite.UVs[6], sprite.UVs[7])
        ];

        for (let i = 0; i < 4; i++) {
            this.QuadVertexBufferBase[this.QuadVertexBufferPtr++] = vertices[i].x;
            this.QuadVertexBufferBase[this.QuadVertexBufferPtr++] = vertices[i].y;
            this.QuadVertexBufferBase[this.QuadVertexBufferPtr++] = vertices[i].z;

            this.QuadVertexBufferBase[this.QuadVertexBufferPtr++] = color.x;
            this.QuadVertexBufferBase[this.QuadVertexBufferPtr++] = color.y;
            this.QuadVertexBufferBase[this.QuadVertexBufferPtr++] = color.z;
            this.QuadVertexBufferBase[this.QuadVertexBufferPtr++] = color.w;

            this.QuadVertexBufferBase[this.QuadVertexBufferPtr++] = textureCoords[i].x;
            this.QuadVertexBufferBase[this.QuadVertexBufferPtr++] = textureCoords[i].y;

            this.QuadVertexBufferBase[this.QuadVertexBufferPtr++] = textureIndex;
        }

        this.QuadIndexCount += 6;
    }

    public GetStats() {
        return this.Stats;
    } 
}
