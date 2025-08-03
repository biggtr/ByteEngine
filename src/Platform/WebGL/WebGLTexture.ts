import { context } from "@/Core/Byte";
import { Vector2 } from "@/Math/Vectors";
import { Texture } from "@/Renderer/Texture";

export class WebGlTexture extends Texture
{

    private m_Webgl: WebGL2RenderingContext;
    private m_Texture: WebGLTexture;
    private m_Sampler: WebGLSampler;
    private m_Size: Vector2;
    private m_ImgSource: ImageBitmap;
    constructor(sourceImage: ImageBitmap)
    {
        super();
        this.m_ImgSource = sourceImage;
        this.m_Size = new Vector2(sourceImage.width, sourceImage.height);
        this.m_Webgl = context.GetContext() as WebGL2RenderingContext;
        this.m_Texture = this.m_Webgl.createTexture();
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, this.m_Texture);
        this.m_Webgl.pixelStorei(this.m_Webgl.UNPACK_FLIP_Y_WEBGL, true);
        this.m_Webgl.pixelStorei(this.m_Webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        this.m_Webgl.pixelStorei(this.m_Webgl.UNPACK_COLORSPACE_CONVERSION_WEBGL, this.m_Webgl.NONE);
        this.m_Webgl.texImage2D(this.m_Webgl.TEXTURE_2D, 0, this.m_Webgl.RGBA,this.m_Webgl.RGBA, this.m_Webgl.UNSIGNED_BYTE, this.m_ImgSource);
        this.m_Webgl.generateMipmap(this.m_Webgl.TEXTURE_2D);
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
    public GetSize(): Vector2
    {
        return this.m_Size;
    }
}
