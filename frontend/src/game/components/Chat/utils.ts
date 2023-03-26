import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, Player } from '../../typings';

export function newChatMessage(author: Player, message: string): ChatMessage {
  return {
    id: uuidv4(),
    message,
    author,
    date: new Date().toISOString(),
  };
}
