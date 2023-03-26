import { observer } from 'mobx-react';
import { useViewModel } from 'mobx-react-viewmodel';
import {
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  TrophyIcon,
  ClockIcon,
  UserIcon,
  StarIcon,
  AdjustmentsVerticalIcon,
} from '@heroicons/react/24/solid';

import { GameRoundScoreboard } from './components/GameRoundScoreboard';
import { Ranking } from './components/Ranking';
import { WelcomeForm } from './components/WelcomeForm';
import { GamePageViewModel } from './GamePageViewModel';
import { GameCanvas } from './components/GameCanvas';
import { Slider } from 'rsuite';
import { NumberControl } from './components/NumberControl';
import { Chat } from './components/Chat';
import { Button } from './components/Button';
import { Tile } from './components/Tile';
import { MULTIPLIER_MAX, MULTIPLIER_MIN } from './models';

export const GamePage = observer(function GamePage() {
  const viewModel = useViewModel(GamePageViewModel);
  const { userId, currentRound, prevRound, player, allPlayers, timeFormatted } =
    viewModel;
  const lastResultRound =
    !currentRound?.isStarted && prevRound ? prevRound : currentRound;

  return (
    <div className="container mx-auto max-w-6xl pt-16 pb-16">
      <div className="grid grid-cols-3 gap-5 mb-6">
        <div className="min-h-full w-full">
          {currentRound && lastResultRound && userId ? (
            <>
              <div
                className="grid grid-cols-2 gap-5 mb-5"
                key={currentRound.id}
              >
                <NumberControl
                  label="Points"
                  min={25}
                  max={player?.score}
                  step={25}
                  value={currentRound.getPlayerPoints(userId)}
                  onChange={(v) => currentRound.setPlayerPoints(userId, v)}
                />

                <NumberControl
                  label="Multiplier"
                  step={0.25}
                  min={MULTIPLIER_MIN}
                  max={MULTIPLIER_MAX}
                  value={currentRound.getPlayerMultiplier(userId)}
                  onChange={(v) => currentRound.setPlayerMultiplier(userId, v)}
                />
              </div>

              <Button
                className="mb-4"
                disabled={
                  currentRound.isStarted ||
                  currentRound.getPlayerPoints(userId) <= 0
                }
                onClick={viewModel.startRount}
              >
                {currentRound.isStarted ? 'Started' : 'Start'}
              </Button>

              <h2 className="mb-2 text-white font-semibold text-lg flex">
                <TrophyIcon
                  className="text-pink-500 mr-2"
                  width={24}
                  height={24}
                />
                Current Round
              </h2>
              <GameRoundScoreboard className="mb-4" round={lastResultRound} />

              <h2 className="mb-2 text-white font-semibold text-lg flex">
                <AdjustmentsVerticalIcon
                  className="text-pink-500 mr-2"
                  width={24}
                  height={24}
                />
                Speed
              </h2>
              <div className="bg-gray-800 border-gray-700 border border-current rounded-lg p-4 pb-2">
                <Slider
                  defaultValue={1}
                  step={1}
                  graduated
                  progress
                  min={1}
                  max={5}
                  tooltip={false}
                  renderMark={(v) => {
                    return (
                      <span
                        className={
                          viewModel.speed >= v ? 'text-pink-500' : 'text-white'
                        }
                      >
                        {v}x
                      </span>
                    );
                  }}
                  value={viewModel.speed}
                  onChange={viewModel.setSpeed}
                />
              </div>
            </>
          ) : (
            <WelcomeForm onSubmit={viewModel.onWelcomeFormSubmit} />
          )}
        </div>
        <div className="min-h-full w-full col-span-2">
          <div className="grid grid-cols-3 gap-5 mb-5">
            <Tile>
              <StarIcon
                className="text-orange-500 mr-2"
                width={24}
                height={24}
              />
              <div className="text-center w-full pr-4">{player?.score}</div>
            </Tile>
            <Tile>
              <UserIcon
                className="text-orange-500 mr-2"
                width={24}
                height={24}
              />
              <div className="text-center w-full pr-4">{player?.name}</div>
            </Tile>
            <Tile>
              <ClockIcon
                className="text-orange-500 mr-2"
                width={24}
                height={24}
              />
              <div className="text-center w-full pr-4">{timeFormatted}</div>
            </Tile>
          </div>

          <GameCanvas
            value={lastResultRound?.resultNumber}
            speed={viewModel?.speed}
            onFinish={lastResultRound?.onFinish}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="min-h-full w-full">
          <h2 className="mb-2 text-white font-semibold text-lg flex">
            <ChartBarIcon
              className="text-pink-500 mr-2"
              width={24}
              height={24}
            />
            Ranking
          </h2>
          <Ranking userId={userId} players={allPlayers} />
        </div>
        <div className="min-h-full w-full">
          <h2 className="mb-2 text-white font-semibold text-lg flex">
            <ChatBubbleLeftRightIcon
              className="text-pink-500 mr-2"
              width={24}
              height={24}
            />
            Chat
          </h2>
          <Chat
            user={player}
            messages={viewModel.chatMessages}
            onNewMessage={viewModel.sendNewMessageToChat}
          />
        </div>
      </div>
    </div>
  );
});
