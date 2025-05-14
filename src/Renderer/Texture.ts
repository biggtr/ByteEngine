
export abstract class Texture
{
    public abstract Init(): Promise<void>
    public abstract Upload(slot: GLenum = 0): void{}
    public abstract Destroy(): void
}
