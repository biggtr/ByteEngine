import { context } from "@/Core/Byte";
import { Vector2 } from "@/Math/Vectors";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";
import { Texture } from "@/Renderer/Texture";


export class WebGPUTexture extends Texture
{

    private m_Device: GPUDevice;
    public m_Texture!: GPUTexture;
    public m_View!: GPUTextureView;
    public m_Sampler!: GPUSampler;
    private m_ImgSource: ImageBitmap;
    private m_Size: Vector2;
    
    constructor(sourceImage: ImageBitmap)
    {
        super();
        this.m_ImgSource = sourceImage;
        this.m_Size = new Vector2(sourceImage.width, sourceImage.height);
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;


        this.m_Texture = this.m_Device.createTexture({
            label: "Texture..!",
            format: "rgba8unorm",
            size: {width: this.m_ImgSource.width, height: this.m_ImgSource.height},
            usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT
        })
        this.m_Device.queue.copyExternalImageToTexture(
                    { source: this.m_ImgSource },
                    { texture: this.m_Texture },
                    { width: this.m_ImgSource.width, height: this.m_ImgSource.height}
                )
        this.m_Sampler = this.m_Device.createSampler({
            minFilter: "linear",
            magFilter: "linear",
            addressModeU: "clamp-to-edge",
            addressModeV: "clamp-to-edge",
        })
        this.m_View = this.m_Texture.createView();
    }
    
    public GetSize(): Vector2 
    {
        return this.m_Size;
    }
    public GetSampler() 
    {
        return this.m_Sampler;
    }
    public Upload(slot: GLenum = 0): void 
    {
    }
    public Destroy(): void 
    {
    }
}
