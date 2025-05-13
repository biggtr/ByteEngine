import { context } from "@/Core/Byte";
import { Texture } from "@/Renderer/Texture";

export class WebGlTexture extends Texture
{

    m_Webgl: WebGLRenderingContext;
    m_texture: WebGLTexture;
    constructor()
    {
        super();
        this.m_Webgl = context.GetContext() as WebGL2RenderingContext;
        this.m_texture = this.m_Webgl.createTexture();
    }
      
    public async Init(textureImage: ImageBitmap): Promise<void>
    {
        const image = textureImage;
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, this.m_texture);
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_MIN_FILTER, this.m_Webgl.LINEAR); 
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_MAG_FILTER, this.m_Webgl.LINEAR); 
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_WRAP_S, this.m_Webgl.CLAMP_TO_EDGE); 
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_WRAP_T, this.m_Webgl.CLAMP_TO_EDGE);
        this.m_Webgl.pixelStorei(this.m_Webgl.UNPACK_FLIP_Y_WEBGL, true);
        this.m_Webgl.texImage2D(this.m_Webgl.TEXTURE_2D, 0, this.m_Webgl.RGBA,this.m_Webgl.RGBA, this.m_Webgl.UNSIGNED_BYTE, image);
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, null);
    }

    public Upload(slot: GLenum = 0)
    {
        this.m_Webgl.activeTexture(this.m_Webgl.TEXTURE0 + slot);
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, this.m_texture);
    } 

    public Destroy()
    {
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, 0);
    }
}
