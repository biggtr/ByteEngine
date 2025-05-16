export interface  ResourceHandler<T>
{
    Load(name: string, path: string): Promise<void>;
    Get(name: string): T;
    UnLoad(name: string): void;
}
