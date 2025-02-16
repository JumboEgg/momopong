import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import NumberButton from '@/components/common/buttons/NumberButton';

interface NumberPadProps {
  onNumberClick: (value:number) => void;
  onSubmit: () => void;
  onClear: () => void;
}

const getVariant = (id: string): 'default' | 'action' => {
  if (id === 'delete' || id === 'enter') return 'action';
  return 'default';
};

function NumberPad({ onNumberClick, onSubmit, onClear }: NumberPadProps): JSX.Element {
  const handleClick = (id: string) => {
    if (id === 'delete') {
      onClear();
    } else if (id === 'enter') {
      onSubmit();
    } else {
      onNumberClick(Number(id));
    }
  };

  const buttons = [
    { id: '1', value: '1', onClick: () => handleClick('1') },
    { id: '2', value: '2', onClick: () => handleClick('2') },
    { id: '3', value: '3', onClick: () => handleClick('3') },
    { id: '4', value: '4', onClick: () => handleClick('4') },
    { id: '5', value: '5', onClick: () => handleClick('5') },
    { id: '6', value: '6', onClick: () => handleClick('6') },
    { id: '7', value: '7', onClick: () => handleClick('7') },
    { id: '8', value: '8', onClick: () => handleClick('8') },
    { id: '9', value: '9', onClick: () => handleClick('9') },
    {
      id: 'delete',
      value: <FontAwesomeIcon icon={faDeleteLeft} className="text-xl sm:text-2xl md:text-3xl" />,
      onClick: () => handleClick('delete'),
    },
    { id: '0', value: '0', onClick: () => handleClick('0') },
    { id: 'enter', value: '↵', onClick: () => handleClick('enter') },
  ];

  return (
    <div className="
      grid grid-cols-3
      gap-1 sm:gap-2 md:gap-3
      w-[200px] sm:w-[240px] md:w-[280px] lg:w-[320px]
      mx-auto
    "
    >
      {buttons.map(({ id, value, onClick }) => (
        <div
          key={id}
          className="
            w-full
            aspect-square
            flex items-center justify-center
          "
        >
          <NumberButton
            value={value}
            onClick={onClick}
            variant={getVariant(id)}
          />
        </div>
      ))}
    </div>
  );
}

export default NumberPad;
