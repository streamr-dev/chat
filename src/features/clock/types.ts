export enum ClockAction {
    Tick = 'tick',
}

export interface ClockState {
    tickedAt: undefined | number
}
