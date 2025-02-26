import { Event, KeyPressedEvent } from "./Events";

export interface EventListener<T>
{
    
    OnEvent(eventData: T): void
}


export class InputListener implements EventListener<KeyPressedEvent>
{

    public OnEvent(eventData: KeyPressedEvent): void 
    {
        if(eventData.m_KeyCode == "KeyW")
        {
            console.log("You Pressed W");
        }
    }
}
