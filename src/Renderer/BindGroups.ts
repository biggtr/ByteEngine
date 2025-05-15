export enum SHADER_TYPE
{
    VERTEX = 1 << 0,
    FRAGMENT = 1 << 1,
    COMPUTE = 1 << 2,
}
export enum RESOURCE_TYPE
{
    BUFFER, TEXTURE, SAMPLER, STORAGE_TEXTURE, EXTERNAL_TEXTURE
}
export interface BindGroupLayout
{
    Name?: string, //u_ModelMatrix
    Binding: number,
    Visibility: SHADER_TYPE,
    ResourceType: RESOURCE_TYPE
    ResourceOptions?: {}
    Data: any //Matrix4x4
}
export abstract class BindGroups
{

    public abstract AddGroupLayout(bindGroupLayout: BindGroupLayout[]): void;
    public GetBindGroupLayouts(): any{}
    public GetBindGroup(index: number): any{}
}

