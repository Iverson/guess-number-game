import styles from './Chat.module.css';

import cx from 'classnames';
import { observer } from 'mobx-react';
import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react';

import { Button } from '../Button';
import { ChatMessage, Player } from '../../typings';
import { newChatMessage } from './utils';

type ChatProps = {
  user?: Player;
  messages: ChatMessage[];
  onNewMessage?: (message: ChatMessage) => void;
} & ComponentPropsWithoutRef<'div'>;

export const Chat = observer(function Chat({
  className,
  user,
  messages = [],
  onNewMessage,
  ...attrs
}: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  }, [messages.length, scrollRef]);

  const disabled = !user;

  return (
    <div
      className={cx(
        'bg-gray-800 border-gray-700 border border-current rounded-lg',
        className,
      )}
      {...attrs}
    >
      <div ref={scrollRef} className={cx('px-3 my-2', styles.messages)}>
        {messages.map((message) => (
          <div key={message.id} className="py-1">
            <span className="text-pink-500 mr-2">
              {message.author.id === user?.id ? 'You' : message.author.name}:
            </span>
            <span className="text-white bg-gray-600 rounded-md p-1 text-xs">
              {message.message}
            </span>
          </div>
        ))}
      </div>
      <form
        className="bg-gray-600 rounded-lg p-2 flex"
        onSubmit={(e) => {
          e.preventDefault();
          !!message && user && onNewMessage?.(newChatMessage(user, message));
          setMessage('');
        }}
      >
        <input
          className="form-input flex-auto h-11 dark:bg-zinc-900 appearance-none border rounded-md w-full py-2 px-4 text-white leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          value={message}
          id="name"
          disabled={disabled}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button className="w-52 flex-auto ml-2 h-auto" type="submit">
          Start
        </Button>
      </form>
    </div>
  );
});
