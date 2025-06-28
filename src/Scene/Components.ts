import { Animation } from "@/Animation/Animation";
import { Vector3 } from "@/Math/Vectors";
import { Texture } from "@/Renderer/Texture";

export enum COMPONENT_TYPE
{
    TRANFORM = 1,
    SPRITE = 1 << 1,
    ANIMATION = 1 << 2,
    PHYSICS = 1 << 3,
}
export class Component
{
    Exists: boolean = false;
}

export class CTransform extends Component
{
    public Position: Vector3 = new Vector3();
    public Scale: Vector3 = new Vector3();
    public Rotation: number = 0;
}

export class CSprite extends Component
{
    public Position: Vector3 = new Vector3();
    public Size: Vector3 = new Vector3();
    public Texture!: Texture;
    public UVs: Float32Array = 
    new Float32Array([
        0.0, 0.0, // bot left
        1.0, 0.0, // bot right
        1.0, 1.0, // top right
        0.0, 1.0, // top left
    ])
}
export class CAnimation extends Component
{
    Animations: Map<string, Animation> = new Map();
    ActiveClip!: string; // change it to enum
}

export class CPhysicsBody extends Component
{
    Acceleration: Vector3 = new Vector3();
    Velocity: Vector3 = new Vector3();
    Position: Vector3 = new Vector3();

    SumForces: Vector3 = new Vector3();
    Mass: number = 1;
    InverseMass: number = 1 / this.Mass; // should not be zero to avoid inf value
}
