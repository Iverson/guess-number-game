import { action, computed, makeObservable, observable } from 'mobx';
import { v4 as uuidv4 } from 'uuid';
import { GameRoundDTO } from '@backend/entities';

import { socket } from '../api/socket';
import { Player } from '../typings';

export const MULTIPLIER_MIN = 1;
export const MULTIPLIER_MAX = 10;

export enum GameRoundState {
  NOT_STARTED = 'NOT_STARTED',
  STARTED = 'STARTED',
  FINISHED = 'FINISHED',
}

export class GameRound {
  readonly id: string;

  @observable.shallow
  private multipliers: Record<string, number> = {};

  @observable.shallow
  points: Record<string, number> = {};

  @observable
  resultNumber?: number;

  @observable
  state = GameRoundState.NOT_STARTED;

  constructor(
    public readonly userId: string,
    public readonly players: Player[],
  ) {
    makeObservable(this);

    this.id = uuidv4();
    socket.on('game:roundFinished', this.roundFinishedHandler);
  }

  dispose() {
    socket.off('game:roundFinished', this.roundFinishedHandler);
  }

  @action
  setPlayerMultiplier = (id: string, value: number) => {
    this.multipliers[id] = value;
  };

  getPlayerMultiplier = (id: string) => {
    return this.multipliers[id];
  };

  @action
  setPlayerPoints = (id: string, value: number) => {
    this.points[id] = value;
  };

  getPlayerPoints = (id: string) => {
    return this.points[id];
  };

  @action
  setResultMultiplier = (value: number) => {
    this.resultNumber = value;
  };

  getPlayerResultScore = (id: string) => {
    const multiplier = this.getPlayerMultiplier(id);
    const points = this.getPlayerPoints(id);

    if (!this.resultNumber) return;
    return multiplier < this.resultNumber ? points * multiplier : 0;
  };

  @action
  start = () => {
    this.state = GameRoundState.STARTED;
    socket.emit('game:playRound', { id: this.id });
  };

  @action
  onFinish = () => {
    this.state = GameRoundState.FINISHED;
  };

  @action
  roundFinishedHandler = ({ id, resultNumber }: GameRoundDTO) => {
    if (this.id === id) {
      this.resultNumber = resultNumber;
    }
  };

  @computed
  get isStarted() {
    return this.state === GameRoundState.STARTED;
  }

  @computed
  get isFinished() {
    return this.state === GameRoundState.FINISHED;
  }
}
