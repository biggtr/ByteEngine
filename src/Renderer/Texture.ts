
export abstract class Texture
{
    public abstract Upload(slot: GLenum = 0): void{}
    public abstract GetSampler(): any;
    public abstract Destroy(): void
}
