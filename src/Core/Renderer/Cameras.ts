import { Matrix3 } from "../Math/Matrices";
import { Vector3 } from "../Math/Vectors";

export class OrthographicCamera
{

    private m_ProjectionMatrix: Matrix3;
    private m_ViewMatrix: Matrix3;
    private m_ViewProjection: Matrix3;
    private m_Position: Vector3 = new Vector3(0,0,0);
    private m_Rotation: number;
    constructor(left: number, right : number, bottom: number, top: number)
    {
        this.m_ProjectionMatrix = Matrix3.Ortho(left, right, bottom, top);
        this.m_ViewMatrix = new Matrix3();
        this.m_ViewProjection = new Matrix3();
        this.m_Rotation = 0;
    }

    public SetProjectionMatrix(left: number, right : number, bottom: number, top: number)
    {
        this.m_ProjectionMatrix = Matrix3.Ortho(left, right, bottom, top);
        this.RecalculateViewProjectionMatrix();
    }
    public GetProjectionMatrix()
    {
        return this.m_ProjectionMatrix;
    }

    public GetViewProjectionMatrix()
    {
        return this.m_ViewProjection;
    }

    public GetPosition()
    {
        return this.m_Position;
    }
    public SetPosition(newPosition: Vector3)
    {
        this.m_Position = newPosition;
        this.RecalculateViewProjectionMatrix();
    }

    public GetRotation()
    {
        return this.m_Rotation;
    }
    public SetRotation(newRotation: number)
    {
        this.m_Rotation = newRotation;
        this.RecalculateViewProjectionMatrix();
    }

    private RecalculateViewProjectionMatrix()
    {
        this.m_ViewMatrix = Matrix3.Rotate(-this.m_Rotation).Multiply(Matrix3.Translate(-this.m_Position.x, -this.m_Position.y));
        this.m_ViewProjection = this.m_ProjectionMatrix.Multiply(this.m_ViewMatrix);
    }
    
}
