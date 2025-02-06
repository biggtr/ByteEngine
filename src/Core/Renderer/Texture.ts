export class Texture
{

    m_webgl: WebGLRenderingContext;
    m_texture: WebGLTexture;
    constructor(webgl: WebGLRenderingContext)
    {
        this.m_webgl = webgl;
        this.m_texture = this.m_webgl.createTexture();
    }
      
    public async CreateTexture(filePath: string)
    {
        const image = await this.LoadFromImage(filePath);
        this.m_webgl.bindTexture(this.m_webgl.TEXTURE_2D, this.m_texture);
        this.m_webgl.texParameteri(this.m_webgl.TEXTURE_2D, this.m_webgl.TEXTURE_MIN_FILTER, this.m_webgl.LINEAR); 
        this.m_webgl.texParameteri(this.m_webgl.TEXTURE_2D, this.m_webgl.TEXTURE_MAG_FILTER, this.m_webgl.LINEAR); 
        this.m_webgl.texParameteri(this.m_webgl.TEXTURE_2D, this.m_webgl.TEXTURE_WRAP_S, this.m_webgl.CLAMP_TO_EDGE); 
        this.m_webgl.texParameteri(this.m_webgl.TEXTURE_2D, this.m_webgl.TEXTURE_WRAP_T, this.m_webgl.CLAMP_TO_EDGE);
        this.m_webgl.texImage2D(this.m_webgl.TEXTURE_2D, 0, this.m_webgl.RGBA,this.m_webgl.RGBA, this.m_webgl.UNSIGNED_BYTE, image);
        this.m_webgl.bindTexture(this.m_webgl.TEXTURE_2D, null);
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
        this.m_webgl.activeTexture(this.m_webgl.TEXTURE0 + slot);
        this.m_webgl.bindTexture(this.m_webgl.TEXTURE_2D, this.m_texture);
    } 

    public UnBind()
    {
        this.m_webgl.bindTexture(this.m_webgl.TEXTURE_2D, 0);
    }
}
