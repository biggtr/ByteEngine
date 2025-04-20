import { Action } from "@/Scene/Actions";
import { Event, BKeyboardEvent,  BMouseEvent } from "../Events/Events";
import { Vector2 } from "@/Math/Vectors";

export enum INPUT_TYPE
{
    KEYUP, KEYDOWN, LEFT_MOUSE_UP, LEFT_MOUSE_DOWN, RIGHT_MOUSE_UP, RIGHT_MOUSE_DOWN
}

export class Input
{
    private m_KeyboardEvent: Event<BKeyboardEvent> = new Event<BKeyboardEvent>;
    private m_Keys: Map<string, boolean> = new Map();

    private m_MouseEvent: Event<BMouseEvent> = new Event<BMouseEvent>
    private m_MouseButtons: Map<number, boolean> = new Map();
    private m_MousePosition: Vector2 = new Vector2(0,0);


    // private m_InputListeners: Map<INPUT_TYPE, (event: Event<any>) => void > = new Map();

    
    public GetKeyboardEvent(): Event<BKeyboardEvent>
    {
        return this.m_KeyboardEvent;
    }
    public IsKeyPressed(keyCode: string): boolean
    {
        return this.m_Keys.get(keyCode) || false;
    }

    public GetMouseEvent(): Event<BMouseEvent>
    {
        return this.m_MouseEvent;
    }
    public IsMousePressed(keyCode: number): boolean
    {
        return this.m_MouseButtons.get(keyCode) || false;
    }
    public GetMousePosition(): Vector2
    {
        return this.m_MousePosition;
    }

    public Initialize(): void
    {
        this.InitializeKeyboard();
        this.InitializeMouse();
    }
    private InitializeKeyboard(): void
    {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if(!event.repeat) //ensures that each key state is updated once only when pressed 
            {
                this.m_Keys.set(event.code, true);
                this.m_KeyboardEvent.Notify(new BKeyboardEvent(event.code, true))
            }
        })
        document.addEventListener("keyup", (event: KeyboardEvent) => {
            this.m_Keys.set(event.code, false);
            this.m_KeyboardEvent.Notify(new BKeyboardEvent(event.code, false))
        })
    }
    private InitializeMouse(): void
    {
        document.addEventListener("mousedown", (event: MouseEvent) => {
            this.m_MouseButtons.set(event.button, true);
            this.m_MouseEvent.Notify(new BMouseEvent(event.button, true, this.m_MousePosition));
        })
        document.addEventListener("mouseup", (event: MouseEvent) => {
            this.m_MouseButtons.set(event.button, false);
            this.m_MouseEvent.Notify(new BMouseEvent(event.button, false, this.m_MousePosition));
        })

        document.addEventListener("mousemove", (event: MouseEvent) => {

            this.m_MousePosition.x = event.clientX;
            this.m_MousePosition.y = event.clientY;
        })

    }
    
   
}
