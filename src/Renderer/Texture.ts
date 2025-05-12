export class Texture
{

    m_Webgl: WebGLRenderingContext;
    m_texture: WebGLTexture;
    constructor(webgl: WebGLRenderingContext)
    {
        this.m_Webgl = webgl;
        this.m_texture = this.m_Webgl.createTexture();
    }
      
    public async Create(textureImage: ImageBitmap)
    {
        const image = textureImage;
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, this.m_texture);
        this.m_Webgl.texImage2D(this.m_Webgl.TEXTURE_2D, 0, this.m_Webgl.RGBA,this.m_Webgl.RGBA, this.m_Webgl.UNSIGNED_BYTE, image);
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_MIN_FILTER, this.m_Webgl.LINEAR); 
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_MAG_FILTER, this.m_Webgl.LINEAR); 
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_WRAP_S, this.m_Webgl.CLAMP_TO_EDGE); 
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_WRAP_T, this.m_Webgl.CLAMP_TO_EDGE);
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, null);
    }

    public Bind(slot: GLenum = 0)
    {
        this.m_Webgl.activeTexture(this.m_Webgl.TEXTURE0 + slot);
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, this.m_texture);
    } 

    public UnBind()
    {
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, 0);
    }
}
