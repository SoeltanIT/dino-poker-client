import { JackpotTag } from './JackpotTag';
import { NewDropTag } from './NewDropTag';
import { NewTag } from './NewTag';
import { IGameTagProps } from './types';

interface GameTagProps extends IGameTagProps {
  type: 'jackpot' | 'new' | 'new-drop';
}

export function GameTag({ type, ...props }: GameTagProps) {
  switch (type) {
    case 'new':
      return <NewTag {...props} />;
    case 'jackpot':
      return <JackpotTag {...props} />;
    case 'new-drop':
      return <NewDropTag {...props} />;

    default:
      return null;
  }
  return <div>GameTag</div>;
}
