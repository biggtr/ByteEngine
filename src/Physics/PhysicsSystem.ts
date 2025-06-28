import { Vector3 } from "@/Math/Vectors";
import { CPhysicsBody } from "@/Scene/Components";

export class BytePhysics
{
    private m_PhysicsBodies: Set<CPhysicsBody> = new Set();
    constructor()
    {
    }
    
    public AddBody(newBody: CPhysicsBody): void
    {
        this.m_PhysicsBodies.add(newBody);
    }

    public Process(deltaTime: number)
    {
        this.m_PhysicsBodies.forEach(body =>{
            this.Integrate(body, deltaTime);
        })
    }
    public Integrate(phyBody: CPhysicsBody , deltaTime: number): void
    {
        if(phyBody.Mass ==  0)
            return;
        phyBody.Acceleration = Vector3.Multiply(phyBody.SumForces, phyBody.InverseMass);
        phyBody.Velocity = Vector3.Add(phyBody.Velocity, phyBody.Acceleration);
        let newVelocity: Vector3 = Vector3.Multiply(phyBody.Velocity, deltaTime);
        phyBody.Position = Vector3.Add(phyBody.Position, newVelocity);

        this.ClearForces(phyBody);
    }

    public AddForce(phyBody: CPhysicsBody, force: Vector3): void
    {
        phyBody.SumForces = Vector3.Add(phyBody.SumForces, force);
    }

    public ClearForces(phyBody: CPhysicsBody): void
    {
        phyBody.SumForces = new Vector3();
    }

}
