import { Vector3 } from "@/Math/Vectors";
import { CPhysicsBody } from "@/Scene/Components";

export function GenerateDragForce(k: number, physicsBody: CPhysicsBody): Vector3
{
    // k is replacing the fluid density and surface area and 1/2 constants that the drag force have to simplify the eq
    if(physicsBody.Velocity.MagnitudeSquared() < 0)
        return new Vector3();

    const dragForceDirection: Vector3 = Vector3.Multiply(physicsBody.Velocity.Normalize(), -1);
    const dragForceMagnitude: number = k * physicsBody.Velocity.MagnitudeSquared();
    const dragForce: Vector3 = Vector3.Multiply(dragForceDirection, dragForceMagnitude);

    return dragForce;
}
