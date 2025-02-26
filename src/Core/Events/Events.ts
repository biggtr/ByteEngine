import { EventListener } from "./EventListeners";

export class Event<T>
{
    private m_Listeners:Array<EventListener<T>> = [];
    
    public AddListener(listener: EventListener<T>): void 
    {
        this.m_Listeners.push(listener);
    }

    public RemoveListener(listener: EventListener<T>): void
    {
        this.m_Listeners = this.m_Listeners.filter((currentListener) => currentListener !== listener );

    }

    public Notify(eventData: T): void 
    {
        for(const listener of this.m_Listeners)
        {
            listener.OnEvent(eventData);
        }

    }
}

export class KeyPressedEvent
{
    public m_KeyCode: string;
    private m_Pressed: boolean;
    constructor(keyCode: string)
    {
        this.m_KeyCode = keyCode;
        this.m_Pressed = true;
    }

}


