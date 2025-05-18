import { context } from "@/Core/Byte";
import { Texture } from "@/Renderer/Texture";

export class WebGlTexture extends Texture
{

    m_Webgl: WebGL2RenderingContext;
    m_Texture: WebGLTexture;
    m_Sampler: WebGLSampler;
    private m_ImgSource: ImageBitmap;
    constructor(sourceImage: ImageBitmap)
    {
        super();
        this.m_ImgSource = sourceImage;
        this.m_Webgl = context.GetContext() as WebGL2RenderingContext;
        this.m_Texture = this.m_Webgl.createTexture();
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, this.m_Texture);
        this.m_Webgl.pixelStorei(this.m_Webgl.UNPACK_FLIP_Y_WEBGL, true);
        this.m_Webgl.texImage2D(this.m_Webgl.TEXTURE_2D, 0, this.m_Webgl.RGBA,this.m_Webgl.RGBA, this.m_Webgl.UNSIGNED_BYTE, this.m_ImgSource);
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, null);

        this.m_Sampler = this.m_Webgl.createSampler();
        this.m_Webgl.samplerParameteri(this.m_Sampler, this.m_Webgl.TEXTURE_MIN_FILTER, this.m_Webgl.LINEAR);
        this.m_Webgl.samplerParameteri(this.m_Sampler, this.m_Webgl.TEXTURE_MAG_FILTER, this.m_Webgl.LINEAR);
        this.m_Webgl.samplerParameteri(this.m_Sampler, this.m_Webgl.TEXTURE_WRAP_S, this.m_Webgl.CLAMP_TO_EDGE);
        this.m_Webgl.samplerParameteri(this.m_Sampler, this.m_Webgl.TEXTURE_WRAP_T, this.m_Webgl.CLAMP_TO_EDGE);
    }
      

    public Upload(slot: GLenum = 0)
    {
        this.m_Webgl.activeTexture(this.m_Webgl.TEXTURE0 + slot);
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, this.m_Texture);
        this.m_Webgl.bindSampler(slot, this.m_Sampler);
    } 
    public GetSampler(): WebGLSampler
    {
        return this.m_Sampler;
    }

    public Destroy()
    {
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, 0);
        this.m_Webgl.deleteTexture(this.m_Texture);
    }
}
