import cx from 'classnames';
import { observer } from 'mobx-react';
import { ComponentPropsWithoutRef } from 'react';
import { isDefinedValue } from '../../utils';
import { GameRound } from '../../models';

type GameRoundScoreboardProps = {
  round: GameRound;
} & ComponentPropsWithoutRef<'div'>;

const thClassName =
  'border-b border-slate-300 dark:border-slate-600 font-semibold py-1 px-6 text-slate-900 dark:text-slate-400 text-left text-xs ';
const tdClassName =
  'border-b border-slate-300 dark:border-slate-700 py-2 px-6 text-sm';

export const GameRoundScoreboard = observer(function GameRoundScoreboard({
  className,
  round,
  ...attrs
}: GameRoundScoreboardProps) {
  return (
    <div
      className={cx(
        'rounded-lg overflow-auto border border-gray-800',
        className,
      )}
    >
      <table
        className="table-fixed break-normal sm:break-all sm:w-full border-collapse "
        {...attrs}
      >
        <thead className="bg-slate-50 dark:bg-zinc-900">
          <tr>
            <th className={thClassName}>Name</th>
            <th className={cx(thClassName, 'text-right')}>Point</th>
            <th className={cx(thClassName, 'text-center')}>Multiplier</th>
          </tr>
        </thead>
        <tbody>
          {round.players.map((player, i) => {
            const resultScore = round.isFinished
              ? round.getPlayerResultScore(player.id)
              : undefined;

            const tdClassNameFull = cx(tdClassName, {
              'text-green-500': isDefinedValue(resultScore) && resultScore > 0,
              'text-red-500': isDefinedValue(resultScore) && resultScore <= 0,
              'dark:text-white': !round.isFinished,
              'dark:bg-slate-800': i % 2 !== 0,
              'dark:bg-slate-900': i % 2 === 0 && round.userId !== player.id,
              'dark:bg-slate-600': round.userId === player.id,
            });

            const score =
              resultScore !== undefined
                ? resultScore
                : Math.floor(round.getPlayerPoints(player.id));

            return (
              <tr key={player.id}>
                <td className={tdClassNameFull}>
                  {round.userId === player.id ? 'You' : player.name}
                </td>
                <td className={cx(tdClassNameFull, 'text-right')}>
                  {Math.floor(score)}
                </td>
                <td className={cx(tdClassNameFull, 'text-center')}>
                  {round.getPlayerMultiplier(player.id)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
