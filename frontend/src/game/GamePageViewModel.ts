import { v4 as uuidv4 } from 'uuid';
import { action, computed, makeObservable, observable, reaction } from 'mobx';
import { ViewModel } from 'mobx-react-viewmodel';

import { ChatMessage, Player } from './typings';
import { GameRound, MULTIPLIER_MAX, MULTIPLIER_MIN } from './models';
import { randomInt, roundNumber } from './utils';
import { newChatMessage } from './components/Chat/utils';
import { socket } from './api/socket';

const PLAYER_POINTS_DEFAULT = 1000;
const ROUND_POINTS_DEFAULT = 100;
const ROUND_PLAYER_POINTS_DEFAULT = 50;

export class GamePageViewModel extends ViewModel {
  @observable.shallow
  players: Record<string, Player> = {};

  @observable
  currentRound?: GameRound;

  @observable.ref
  prevRound?: GameRound;

  @observable
  userId?: string;

  @observable
  speed = 1;

  @observable.ref
  chatMessages: ChatMessage[] = [];

  @observable.ref
  private dateTime: Date = new Date();

  constructor() {
    super(undefined);
    makeObservable(this);

    const timer = window.setInterval(
      action(() => (this.dateTime = new Date())),
      1000,
    );

    this.disposers.push(
      reaction(
        () => this.currentRound?.isFinished,
        (isFinished) => isFinished && this.onCurrentRoundFinished(),
      ),
      () => socket.off('chat:receiveMessage', this.recieveNewChatMessage),
      () => window.clearInterval(timer),
    );
  }

  init() {
    socket.on('chat:receiveMessage', this.recieveNewChatMessage);
  }

  @computed
  get timeFormatted() {
    return `${this.dateTime.getHours()}:${this.dateTime.getMinutes()}`;
  }

  @action
  createNewGameRound = () => {
    if (!this.userId) return;

    const round = new GameRound(this.userId, [...this.allPlayers]);

    this.allPlayers.forEach((player) => {
      if (player.id === this.userId) {
        round.setPlayerPoints(
          player.id,
          Math.min(player.score, ROUND_PLAYER_POINTS_DEFAULT),
        );
        round.setPlayerMultiplier(player.id, MULTIPLIER_MIN);
      } else {
        // Set fake points/multipliers for auto-players
        round.setPlayerPoints(
          player.id,
          Math.min(player.score, ROUND_POINTS_DEFAULT),
        );
        round.setPlayerMultiplier(
          player.id,
          randomInt(MULTIPLIER_MIN, MULTIPLIER_MAX),
        );
      }
    });
    this.currentRound = round;
  };

  @action
  onWelcomeFormSubmit = (playerName: string) => {
    const player = this.createNewPlayer(playerName);
    this.userId = player.id;

    // Create Auto-players
    this.players = [...Array(4)].reduce(
      (result, _, i) => {
        const player = this.createNewPlayer(`CPU ${i + 1}`);
        result[player.id] = player;
        return result;
      },
      { [player.id]: player } as Record<string, Player>,
    );

    this.createNewGameRound();

    // Create fake chat messages for auto-players
    const timer = window.setTimeout(() => {
      const fakeMessages = ['hi guys', 'Hi man', "What's up?", 'What a game!'];
      Object.values(this.players)
        .filter((p) => p.id !== player.id)
        .forEach((player, i) => {
          setTimeout(
            () =>
              this.sendNewMessageToChat(
                newChatMessage(player, fakeMessages[i]),
              ),
            2000 * i,
          );
        });
    }, 3000);

    return () => window.clearTimeout(timer);
  };

  @computed
  get player(): Player | undefined {
    return this.userId ? this.players[this.userId] : undefined;
  }

  @computed
  get allPlayers(): Player[] {
    return Object.values(this.players);
  }

  @action
  onCurrentRoundFinished = () => {
    if (!this.currentRound) return;
    this.currentRound.dispose();
    this.saveRoundScores(this.currentRound);
    this.prevRound = this.currentRound;
    this.createNewGameRound();
  };

  @action
  saveRoundScores = (round: GameRound) => {
    // TODO: move all scoring logic to backend in real multi-player game
    round.players.forEach(({ id }) => {
      const player = this.players[id];
      this.players[id] = {
        ...player,
        score: roundNumber(
          player.score + (round.getPlayerResultScore(id) || 0),
        ),
      };
    });
  };

  @action
  setSpeed = (value: number) => {
    this.speed = value;
  };

  @action
  startRount = () => {
    const round = this.currentRound;
    if (!round) return;

    round.start();
    // TODO: move all scoring logic to backend in real multi-player game
    round.players.forEach(({ id }) => {
      const player = this.players[id];
      this.players[id] = {
        ...player,
        score: roundNumber(player.score - (round.getPlayerPoints(id) || 0)),
      };
    });
  };

  @action
  sendNewMessageToChat = (message: ChatMessage) => {
    socket.emit('chat:sendMessage', message);
  };

  @action
  private createNewPlayer = (name: string): Player => {
    return {
      id: uuidv4(),
      name: name,
      score: PLAYER_POINTS_DEFAULT,
    };
  };

  @action
  private recieveNewChatMessage = (message: ChatMessage) => {
    this.chatMessages = [...this.chatMessages, message];
  };
}
