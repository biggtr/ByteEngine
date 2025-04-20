
export class Vector4
{
    m_Magnitude: number = 0;
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x: number, y: number, z: number,w: number)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }


    static Add(v1: Vector4, v2: Vector4): Vector4
    {
        return new Vector4(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z, v1.w + v2.w);
    }
    
    static Subtract(v1: Vector4, v2: Vector4) 
    {
        return new Vector4(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z, v1.w - v2.w);
    }

    static Dot(v1: Vector4, v2: Vector4): number
    {
        return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w);
    }

    Magnitude(): number 
    {
        this.m_Magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        return this.m_Magnitude;
    } 

    Normalize(): Vector4
    {

        if(this.m_Magnitude === 0)
        {
            return new Vector4(0,0,0,0);
        }
        return new Vector4(this.x / this.m_Magnitude,this.y / this.m_Magnitude, this.z / this.m_Magnitude,this.w / this.m_Magnitude);
    }

}
export class Vector3
{
    m_Magnitude: number = 0;
    x: number;
    y: number;
    z: number;
    constructor(x: number = 1, y: number = 1, z: number = 1)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    static Add(v1: Vector3, v2: Vector3): Vector3 {
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }
    static Subtract(v1: Vector4, v2: Vector4) 
    {
        return new Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }

    static Dot(v1: Vector3, v2: Vector3): number
    {
        return (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z );
    }

    static Cross(v1: Vector3, v2: Vector3): Vector3
    {
        return new Vector3(
            v1.y * v2.z - v1.z * v2.y,
            v1.z * v2.x - v1.x * v2.z,
            v1.x * v2.y - v1.y * v2.x,
        )
    }

    Magnitude(): number 
    {
        this.m_Magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return this.m_Magnitude;
    } 

    Normalize(): Vector3
    {

        if(this.m_Magnitude === 0)
        {
            return new Vector3(0,0,0);
        }
        return new Vector3(this.x / this.m_Magnitude,this.y / this.m_Magnitude, this.z / this.m_Magnitude);
    }
}
export class Vector2
{
    m_Magnitude: number = 0;
    x: number;
    y: number;
    constructor(x: number = 1, y: number = 1 )
    {
        this.x = x;
        this.y = y;
    }
    
    static Add(v1: Vector2, v2: Vector2): Vector2 {
        return new Vector2(v1.x + v2.x, v1.y + v2.y);
    }
    static Subtract(v1: Vector2, v2: Vector2) 
    {
        return new Vector2(v1.x - v2.x, v1.y - v2.y );
    }

    static Dot(v1: Vector2, v2: Vector2): number
    {
        return (v1.x * v2.x + v1.y * v2.y);
    }


    Magnitude(): number 
    {
        this.m_Magnitude = Math.sqrt(this.x * this.x + this.y * this.y);
        return this.m_Magnitude;
    } 

    Normalize(): Vector2
    {

        if(this.m_Magnitude === 0)
        {
            return new Vector2(0,0);
        }
        return new Vector2(this.x / this.m_Magnitude,this.y / this.m_Magnitude);
    }
}
