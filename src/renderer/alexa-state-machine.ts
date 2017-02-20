export enum State {
    Idle, Recording, Speaking,
}

export class AlexaStateMachine {
    private state: State;

    constructor() {
        this.state = State.Idle;
    }

    public get CurrentState(): State {
        return this.state;
    }
}
