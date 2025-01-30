import NumberPad from '@/components/common/numberpad/NumberPad';

// 모달 컴포넌트
function NumModal() {
  const getRandom = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);
  const num1 = getRandom(1, 10);
  const num2 = getRandom(1, 10);
  const result = num1 * num2;

  return (
    <div className="max-w-[750px] min-h-[510px] bg-[#FFF08E]
      flex items-center justify-around p-4 rounded-[2vw] overflow-hidden"
    >
      <div>
        정답을 입력하세요
        <p>{result}</p>
      </div>
      <NumberPad />
    </div>
  );
}

export default NumModal;
