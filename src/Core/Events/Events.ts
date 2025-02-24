export enum EventType
{
    KeyPressed, MouseEvent

}

abstract class Event
{
    abstract GetType(): EventType
    static GetTypeStatic(): EventType
    {
        throw new Error("Not Implemented yet.");
    }
}

class KeyPressed implements Event
{
    private m_KeyCode: string;
    private m_Pressed: boolean;
    constructor(keyCode: string)
    {
        this.m_KeyCode = keyCode;
        this.m_Pressed = true;
    }
    GetType(): EventType
    {
        return EventType.KeyPressed;
    }

    static GetTypeStatic(): EventType
    {
        return EventType.KeyPressed;
    }
}


