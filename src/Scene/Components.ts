import { Vector3 } from "@/Math/Vectors";

export abstract class Component
{
    protected m_Exists: boolean = false;
}


export class CTransform extends Component
{
    public Position: Vector3;
    public Scale: Vector3;
    public Rotation: number;

    constructor(position: Vector3 = new Vector3(), scale: Vector3 = new Vector3(), rotation: number = 1)
    {
        super();
        this.Position = position;
        this.Scale = scale;
        this.Rotation = rotation;
    }
}
