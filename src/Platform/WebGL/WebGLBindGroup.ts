import { BindGroupLayout, BindGroup, } from "@/Renderer/BindGroup";

export class WebGLBindGroup extends BindGroup
{

    private m_Resources!: BindGroupLayout[];

    constructor()
    {
        super();
    }
    public AddGroupLayout(bindGroupLayout: BindGroupLayout[]): void 
    {
        this.m_Resources = bindGroupLayout;
    }
    public GetBindGroup(): BindGroupLayout[]
    {
        return this.m_Resources;
    }

}

