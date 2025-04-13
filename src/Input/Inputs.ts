import { Event, KeyPressedEvent } from "../Events/Events";


export class Input
{
    private m_KeyPressedEvent: Event<KeyPressedEvent> = new Event<KeyPressedEvent>;
    private m_Keys: Map<string, boolean> = new Map();
    public GetKeyboadEvent(): Event<KeyPressedEvent>
    {
        return this.m_KeyPressedEvent;
    }
    public IsKeyPressed(keyCode: string): boolean
    {
        return this.m_Keys.get(keyCode) || false;
    }
    public Initialize(): void
    {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if(!event.repeat) //ensures that each key state is updated once only when pressed 
            {
                this.m_Keys.set(event.code, true);
                this.m_KeyPressedEvent.Notify(new KeyPressedEvent(event.code, true))
            }
        })
        document.addEventListener("keyup", (event: KeyboardEvent) => {
            this.m_Keys.set(event.code, false);
            this.m_KeyPressedEvent.Notify(new KeyPressedEvent(event.code, false))
        })
    }
    
   
}
