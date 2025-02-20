import { Vector3 } from "./Vectors";

export class Matrix3
{
    private m_Data: Float32Array;
    constructor()
    {
        this.m_Data = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }

    
    public Get(row: number, col: number): number
    {
        return this.m_Data[col * 3 + row];
    }
    public GetAll()
    {
        return this.m_Data;
    }


    /*[
     * Row Major  Col Major
     * 0,1,2      0,3,6
     * 3,4,5  >>  1,4,7     this is all indices so that you know how to convert from one to another (you always multiply row by col)
     * 6,7,8      2,5,8
     * ]*/

    public Multiply(v: Vector3): Vector3
    public Multiply(mat: Matrix3): Matrix3
    public Multiply(param: Vector3 | Matrix3): Vector3 | Matrix3
    {

        if (param instanceof Vector3)
        {

            return new Vector3(
                this.m_Data[0] * param.x + this.m_Data[3] * param.y + this.m_Data[6] * param.z,
                this.m_Data[1] * param.x + this.m_Data[4] * param.y + this.m_Data[7] * param.z,
                this.m_Data[2] * param.x + this.m_Data[5] * param.y + this.m_Data[8] * param.z
            )
        }
        else if(param instanceof Matrix3) // both matrices is in column major layout
        {
            var result = new Matrix3();
            result.m_Data[0] = this.m_Data[0] * param.m_Data[0] + this.m_Data[3] * param.m_Data[1] + this.m_Data[6] * param.m_Data[2];
            result.m_Data[1] = this.m_Data[1] * param.m_Data[0] + this.m_Data[4] * param.m_Data[1] + this.m_Data[7] * param.m_Data[2];
            result.m_Data[2] = this.m_Data[2] * param.m_Data[0] + this.m_Data[5] * param.m_Data[1] + this.m_Data[8] * param.m_Data[2];

            result.m_Data[3] = this.m_Data[0] * param.m_Data[3] + this.m_Data[3] * param.m_Data[4] + this.m_Data[6] * param.m_Data[5];
            result.m_Data[4] = this.m_Data[1] * param.m_Data[3] + this.m_Data[4] * param.m_Data[4] + this.m_Data[7] * param.m_Data[5];
            result.m_Data[5] = this.m_Data[2] * param.m_Data[3] + this.m_Data[5] * param.m_Data[4] + this.m_Data[8] * param.m_Data[5];

            result.m_Data[6] = this.m_Data[0] * param.m_Data[6] + this.m_Data[3] * param.m_Data[7] + this.m_Data[6] * param.m_Data[8];
            result.m_Data[7] = this.m_Data[1] * param.m_Data[6] + this.m_Data[4] * param.m_Data[7] + this.m_Data[7] * param.m_Data[8];
            result.m_Data[8] = this.m_Data[2] * param.m_Data[6] + this.m_Data[5] * param.m_Data[7] + this.m_Data[8] * param.m_Data[8];
            return result;
        }
        throw new Error("Invalid parameter type for Multiply method.");
    }

    public static Identity(): Matrix3
    {
        return new Matrix3();
    }

    public static Rotate(angle: number): Matrix3
    {
        var rotationMatrix = new Matrix3();
        rotationMatrix.m_Data[0] =  Math.cos(angle);
        rotationMatrix.m_Data[3] = -Math.sin(angle);
        rotationMatrix.m_Data[1] =  Math.sin(angle);
        rotationMatrix.m_Data[4] =  Math.cos(angle);
        return rotationMatrix;
    }
    public static Scale(sx: number, sy: number): Matrix3
    {
        var scaleMatrix = new Matrix3();
        scaleMatrix.m_Data[0] = sx;
        scaleMatrix.m_Data[4] = sy;
        return scaleMatrix
    }
    public static Translate(tx: number, ty: number): Matrix3
    {
        var translationMatrix = new Matrix3();
        translationMatrix.m_Data[6] = tx;
        translationMatrix.m_Data[7] = ty;
        return translationMatrix;
    }
    public static Ortho(left: number, right: number, bot: number, top: number): Matrix3
    {
        var horizontalLength = 1 / right - left;
        var verticalLength = 1 / top - bot;
        var orthoMatrix = new Matrix3();
        orthoMatrix.m_Data[0] = 2 * horizontalLength;
        orthoMatrix.m_Data[6] = -(right + left) * horizontalLength;
        orthoMatrix.m_Data[4] = 2 * verticalLength;
        orthoMatrix.m_Data[6] = -(top + bot) * horizontalLength;
        return orthoMatrix;
    }

    
}
