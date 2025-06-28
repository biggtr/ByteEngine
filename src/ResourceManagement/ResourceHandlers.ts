export interface  ResourceHandler<T>
{
    Load(name: string, path: string): Promise<T>;
    Get(name: string): T;
    UnLoad(name: string): void;
}
