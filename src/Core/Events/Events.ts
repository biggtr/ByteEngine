
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

export class KeyPressedEvent
{
    public m_KeyCode: string;
    public m_Pressed: boolean;
    constructor(keyCode: string, pressed: boolean)
    {
        this.m_KeyCode = keyCode;
        this.m_Pressed = pressed;
    }

}


