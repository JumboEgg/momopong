import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDeleteLeft } from '@fortawesome/free-solid-svg-icons';
import NumberButton from '@/components/common/buttons/NumberButton';

function NumberPad() {
  const buttons = [
    { id: '1', value: '1' },
    { id: '2', value: '2' },
    { id: '3', value: '3' },
    { id: '4', value: '4' },
    { id: '5', value: '5' },
    { id: '6', value: '6' },
    { id: '7', value: '7' },
    { id: '8', value: '8' },
    { id: '9', value: '9' },
    { id: 'delete', value: <FontAwesomeIcon icon={faDeleteLeft} /> },
    { id: '0', value: '0' },
    { id: 'enter', value: '↵' },
  ];

  return (
    <div className="grid grid-cols-3 gap-1 w-[280px]">
      {buttons.map(({ id, value }) => (
        <div key={id} className="w-full aspect-square">
          <NumberButton
            value={value}
            onClick={(val) => console.log(val)}
          />
        </div>
      ))}
    </div>
  );
}

export default NumberPad;
