import { Matrix3, Matrix4 } from "../Math/Matrices";
import { Vector3 } from "../Math/Vectors";

export class OrthographicCamera
{

    private m_ProjectionMatrix: Matrix4;
    private m_ViewMatrix: Matrix4;
    private m_ViewProjection: Matrix4;
    private m_Position: Vector3 = new Vector3(0,0,0);
    private m_Rotation: Vector3 = new Vector3(0,0,0);
    constructor(left: number, right : number, bottom: number, top: number, zNear: number, zFar: number)
    {
        this.m_ProjectionMatrix = Matrix4.Ortho(left, right, bottom, top, zNear, zFar);
        this.m_ViewMatrix = new Matrix4();
        this.m_ViewProjection = new Matrix4();
    }

    public SetProjectionMatrix(left: number, right : number, bottom: number, top: number, zNear: number, zFar: number)
    {
        this.m_ProjectionMatrix = Matrix4.Ortho(left, right, bottom, top, zNear, zFar);
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
    public SetRotation(newRotation: Vector3)
    {
        this.m_Rotation = newRotation;
        this.RecalculateViewProjectionMatrix();
    }

    private RecalculateViewProjectionMatrix()
    {
        this.m_ViewMatrix = Matrix4.Rotate(-this.m_Rotation.x, -this.m_Rotation.y, -this.m_Rotation.z).Multiply(Matrix4.Translate(-this.m_Position.x, -this.m_Position.y, -this.m_Position.z));
        
        this.m_ViewProjection = this.m_ProjectionMatrix.Multiply(this.m_ViewMatrix);
    }
    
}
