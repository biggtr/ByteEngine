import { context } from "@/Core/Byte";
import { WebGPUContextData } from "@/Renderer/GraphicsContext";
import { Texture } from "@/Renderer/Texture";


export class WebGPUTexture extends Texture
{

    private m_Device: GPUDevice;
    public m_Texture!: GPUTexture;
    public m_View!: GPUTextureView;
    public m_Sampler!: GPUSampler;
    private m_ImgSource: ImageBitmap;
    
    constructor(sourceImage: ImageBitmap)
    {
        super();
        this.m_ImgSource = sourceImage;
        const webgpuContext = context.GetContext() as WebGPUContextData;
        this.m_Device = webgpuContext.Device;

        this.m_Texture = this.m_Device.createTexture({
            label: "Texture..!",
            format: "rgba8unorm",
            size: {width: this.m_ImgSource.width, height: this.m_ImgSource.height},
            usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.RENDER_ATTACHMENT
        })
        this.m_Sampler = this.m_Device.createSampler({
            minFilter: "linear",
            magFilter: "linear",
            addressModeU: "clamp-to-edge",
            addressModeV: "clamp-to-edge",
        })
        this.m_View = this.m_Texture.createView();
    }
    public async Init(): Promise<void> 
    {
        this.m_Device.queue.copyExternalImageToTexture(
            { source: this.m_ImgSource },
            { texture: this.m_Texture },
            { width: this.m_ImgSource.width, height: this.m_ImgSource.height}
        )
    }
    public Upload(slot: GLenum = 0): void 
    {
    }
    public Destroy(): void 
    {
    }
}
