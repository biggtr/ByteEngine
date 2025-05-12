
export abstract class Texture
{
    public abstract Init(textureImage: ImageBitmap): Promise<void>
    public abstract Bind(slot: GLenum): void
    public abstract UnBind(): void
}
