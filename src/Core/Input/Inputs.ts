import { Event, KeyPressedEvent } from "../Events/Events";


export class Input
{
    private m_KeyPressedEvent: Event<KeyPressedEvent> = new Event<KeyPressedEvent>;
    
    public GetKeyboadEvent(): Event<KeyPressedEvent>
    {
        return this.m_KeyPressedEvent;
    }
    public IsKeyPressed(): void
    {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            this.m_KeyPressedEvent.Notify(new KeyPressedEvent(event.code, true))
        })
        document.addEventListener("keyup", (event: KeyboardEvent) => {
            this.m_KeyPressedEvent.Notify(new KeyPressedEvent(event.code, false))
        })
    }
    
   
}
