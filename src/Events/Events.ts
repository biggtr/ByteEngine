import { Vector2, Vector3 } from "@/Math/Vectors";

export class Event<T>
{
    private m_Listeners: Set<(data: T) => void> = new Set();
    
    public Subscribe(callback: (data: T) => void): void 
    {
        this.m_Listeners.add(callback);
    }

    public UnSubscribe(callback: (data: T) => void): void
    {
        this.m_Listeners.delete(callback);
    }

    public Notify(data: T): void 
    {
        this.m_Listeners.forEach(callback => callback(data))
    }
}

export class BKeyboardEvent
{
    public m_KeyCode: string;
    public m_Pressed: boolean;
    constructor(keyCode: string, pressed: boolean)
    {
        this.m_KeyCode = keyCode;
        this.m_Pressed = pressed;
    }

}


export class BMouseEvent 
{
    public m_ButtonKey: number;
    public m_Pressed: boolean;
    public m_MousePosition: Vector2;

    constructor(keyCode: number, pressed: boolean, mousePosition: Vector2)
    {
        this.m_ButtonKey = keyCode;
        this.m_Pressed = pressed;
        this.m_MousePosition = mousePosition;
    }

}

