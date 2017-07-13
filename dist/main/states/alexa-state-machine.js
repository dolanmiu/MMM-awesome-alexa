"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const busy_state_1 = require("./busy.state");
const idle_state_1 = require("./idle.state");
const listening_state_1 = require("./listening.state");
class AlexaStateMachine {
    constructor(components) {
        this.idleState = new idle_state_1.IdleState(components);
        this.listeningState = new listening_state_1.ListeningState(components);
        this.busyState = new busy_state_1.BusyState(components);
        this.idleState.AllowedStateTransitions = new Map([["listening", this.listeningState]]);
        this.listeningState.AllowedStateTransitions = new Map([["busy", this.busyState], ["idle", this.idleState]]);
        this.busyState.AllowedStateTransitions = new Map([["idle", this.idleState]]);
        this.currentState = this.idleState;
        this.currentState.onEnter();
    }
    get CurrentState() {
        return this.currentState;
    }
}
exports.AlexaStateMachine = AlexaStateMachine;
