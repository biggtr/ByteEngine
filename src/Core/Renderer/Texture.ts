export class Texture
{

    m_Webgl: WebGLRenderingContext;
    m_texture: WebGLTexture;
    constructor(webgl: WebGLRenderingContext)
    {
        this.m_Webgl = webgl;
        this.m_texture = this.m_Webgl.createTexture();
    }
      
    public async Create(filePath: string)
    {
        const image = await this.LoadFromImage(filePath);
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, this.m_texture);
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_MIN_FILTER, this.m_Webgl.LINEAR); 
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_MAG_FILTER, this.m_Webgl.LINEAR); 
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_WRAP_S, this.m_Webgl.CLAMP_TO_EDGE); 
        this.m_Webgl.texParameteri(this.m_Webgl.TEXTURE_2D, this.m_Webgl.TEXTURE_WRAP_T, this.m_Webgl.CLAMP_TO_EDGE);
        this.m_Webgl.pixelStorei(this.m_Webgl.UNPACK_FLIP_Y_WEBGL, true);
        this.m_Webgl.texImage2D(this.m_Webgl.TEXTURE_2D, 0, this.m_Webgl.RGBA,this.m_Webgl.RGBA, this.m_Webgl.UNSIGNED_BYTE, image);
        this.m_Webgl.bindTexture(this.m_Webgl.TEXTURE_2D, null);
    }
    private async LoadFromImage(filePath: string): Promise<HTMLImageElement>
    {

        try
        {
            const response = await fetch(filePath);
            if(!response.ok)
            {
                throw new Error("Failed To Load Texture..!");
            }
            const blob = await response.blob(); 
            const objectURL = URL.createObjectURL(blob);

            const image = new Image()
            await new Promise((resolve, reject) =>{

                image.onload = resolve;
                image.onerror = reject;
                image.src = objectURL;
            });

            return image;

        }
        catch(error)
        {
            throw new Error("Failed To Load Texture..!");
        }

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
