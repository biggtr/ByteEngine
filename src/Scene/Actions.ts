export enum ACTION_TYPE
{
    MOVE_RIGHT, MOVE_LEFT, MOVE_UP, MOVE_DOWN, JUMP, ATTACK,
}
export enum ACTION_STATUS
{
    START, END,
}
export class Action
{
    private m_Type: ACTION_TYPE;
    private m_Status: ACTION_STATUS;

    constructor(type: ACTION_TYPE, status: ACTION_STATUS)
    {
        this.m_Type = type;
        this.m_Status = status;
    }

    public GetType(): ACTION_TYPE
    {
        return this.m_Type;
    }

    public GetStatus(): ACTION_STATUS
    {
        return this.m_Status;
    }
}
