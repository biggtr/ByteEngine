import { Event, KeyPressedEvent } from "./Events";

export interface EventListener
{
    
    OnEvent(eventData: unknown): void
}


export class InputListener implements EventListener{

    public OnEvent(eventData: KeyPressedEvent): void 
    {
        if(eventData.m_KeyCode == "KeyW")
        {
            console.log("You Pressed W");
        }
    }
}
