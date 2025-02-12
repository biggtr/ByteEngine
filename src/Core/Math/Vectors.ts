
export class Vector4
{
    constructor(public x: number, public y: number, public z: number, public w: number)
    {
         
    }
    
    static add(v1: Vector4, v2: Vector4): Vector4
    {
        return new Vector4(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
    }
}
export class Vector3
{
    constructor(public x: number, public y: number, public z: number)
    {
         
    }
    
    static add(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
}
