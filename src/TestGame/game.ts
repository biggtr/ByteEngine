import { Application, EngineComponents } from "@/Core/Application";
import { Renderer2D } from "@/Core/Renderer/Renderer2D";
import { Texture } from "@/Core/Renderer/Texture";
import { Vector4 } from "@/Core/Math/Vectors";
import { WebGLContext } from "@/Core/Renderer/WebGLContext";
import { Vector3 } from "@/Core/Math/Vectors";
import { OrthographicCamera } from "@/Core/Renderer/Cameras";
import { Input } from "@/Core/Input/Inputs";



//Ugly Class Will remove it in future just for testing 
export class TestGame extends Application
{
    private m_Renderer2D: Renderer2D | null = null;
    private m_WebGL: WebGLContext | null = null; 
    private input: Input| null = null;
    private position: Vector3 = new Vector3(0,200,1);
    private size = new Vector3(200, 200, 1);
    private camera: OrthographicCamera | null = null;
    protected OnInit(engineComponents: EngineComponents): void  
    {
        this.m_Renderer2D = engineComponents.renderer2D as Renderer2D;
        this.m_WebGL = engineComponents.webGL as WebGLContext;
        this.input = engineComponents.inputSystem as Input;
        var webgl = this.m_WebGL.GetWebGL();
        this.camera = new OrthographicCamera(
            0,  // left
            webgl.canvas.width,   // right
            0, // bottom
            webgl.canvas.height   // top
        );
    }
    protected OnRender(): void
    {

        let color = new Vector4(1.0,0,0,0);
        let quadColor = new Vector4(0.4,0.7,0,0);
        this.m_Renderer2D?.SetClearColor(color);
        this.m_Renderer2D?.Clear();
        this.m_Renderer2D?.BeginScene(this.camera as OrthographicCamera);
        this.m_Renderer2D?.DrawQuad(this.position, this.size, quadColor);
    }
    protected OnUpdate(deltaTime: number): void
    {

        var movement = new Vector3(0,0,0);
        const prevCameraPosition = this.camera?.GetPosition();
        const moveSpeed = 4;
        if (this.input?.IsKeyPressed("KeyW"))
        {
          movement.y += moveSpeed; 
          console.log("pressed w");
        }
        if (this.input?.IsKeyPressed("KeyS"))
        {
          movement.y -= moveSpeed; 
        }
        if (this.input?.IsKeyPressed("KeyA")) 
        {
          movement.x -= moveSpeed; 
        }
        if (this.input?.IsKeyPressed("KeyD")) 
        {
          movement.x += moveSpeed; 
        }
        const newPosition = Vector3.Add(movement, prevCameraPosition as Vector3);
        // Update the camera position
        this.camera?.SetPosition(newPosition);
    }
}
