
export interface ResourceHandler<T>
{
    Load(path: string): Promise<T>;
    Get(path: string): T;
    UnLoad(path: string): void;
}
