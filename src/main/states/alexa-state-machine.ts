import { Models } from "snowboy";
import { AudioService } from "../alexa-voice-service";
import { ConfigService } from "../config-service";
import { AlexaDetector } from "../detector";
import { MicHandler } from "../mic-handler";
import { Recorder } from "../recorder";
import { RendererCommunicator } from "../renderer-communicator";
import { State } from "./base.state";
import { BusyState } from "./busy.state";
import { IdleState } from "./idle.state";
import { ListeningState } from "./listening.state";

export interface IStateMachineComponents {
    recorder: Recorder;
    detector?: AlexaDetector;
    audioService: AudioService;
    configService: ConfigService;
    rendererSend: (event: NotificationType, payload: object) => void;
    rendererCommunicator: RendererCommunicator;
    micHandler: MicHandler;
    models: Models;
}

export class AlexaStateMachine {
    private currentState: State;
    private idleState: IdleState;
    private listeningState: ListeningState;
    private busyState: BusyState;

    constructor(components: IStateMachineComponents) {
        this.idleState = new IdleState(components);
        this.listeningState = new ListeningState(components);
        this.busyState = new BusyState(components);

        this.idleState.AllowedStateTransitions = new Map<StateName, State>([["listening", this.listeningState]]);
        this.listeningState.AllowedStateTransitions = new Map<StateName, State>([["busy", this.busyState], ["idle", this.idleState]]);
        this.busyState.AllowedStateTransitions = new Map<StateName, State>([["idle", this.idleState]]);

        this.currentState = this.idleState;
        this.currentState.onEnter();
    }

    public get CurrentState(): State {
        return this.currentState;
    }
}
