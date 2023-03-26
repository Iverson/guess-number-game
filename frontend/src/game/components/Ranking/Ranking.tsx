import cx from 'classnames';
import { observer } from 'mobx-react';
import { ComponentPropsWithoutRef } from 'react';
import { Player } from '../../typings';

type RankingProps = {
  userId?: string;
  players: Player[];
} & ComponentPropsWithoutRef<'div'>;

const FAKE_ROWS: Player[] = [...Array(5)].map((_, i) => ({
  id: String(i),
  name: '',
  score: 0,
}));

const thClassName =
  'border-b border-slate-300 dark:border-slate-600 font-semibold py-1 px-6 text-slate-900 dark:text-slate-400 text-left text-xs ';
const tdClassName =
  'border-b border-slate-300 dark:border-slate-700 py-2 px-6 dark:text-white text-sm';

export const Ranking = observer(function Ranking({
  className,
  userId,
  players,
  ...attrs
}: RankingProps) {
  return (
    <div
      className={cx(
        'rounded-lg overflow-auto border border-gray-800',
        className,
      )}
      {...attrs}
    >
      <table className="table-fixed break-normal sm:break-all sm:w-full border-collapse ">
        <thead className="bg-slate-50 dark:bg-zinc-900">
          <tr>
            <th className={thClassName}>No</th>
            <th className={thClassName}>Name</th>
            <th className={thClassName}>Score</th>
          </tr>
        </thead>
        <tbody>
          {(players?.length ? players : FAKE_ROWS)
            .sort((a, b) => b.score - a.score)
            .map((player, i) => {
              const isYou = userId === player.id;
              const tdClassNameFull = cx(tdClassName, {
                'dark:bg-slate-800': !isYou && i % 2 !== 0,
                'dark:bg-slate-900': !isYou && i % 2 === 0,
                'dark:bg-slate-600': isYou,
              });

              return (
                <tr key={player.id} className="animate-in fade-in duration-500">
                  <td className={tdClassNameFull}>{i + 1}</td>
                  <td className={tdClassNameFull}>
                    {isYou ? 'You' : player.name || '-'}
                  </td>
                  <td className={tdClassNameFull}>
                    {player.name ? player.score : '-'}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
});
