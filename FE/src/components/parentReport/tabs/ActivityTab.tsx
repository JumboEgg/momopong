// import { useReportStore } from '@/stores/reportStore';
import { ActivityHistoryInfo } from '@/types/report';
import { getCoverPath } from '@/utils/format/imgPath';

const data: ActivityHistoryInfo[] = [
  {
    bookTitle: '신데렐라',
    bookPath: 'cover_cinderella.webp',
    readCount: 102942,
  },
  {
    bookTitle: '인어공주',
    bookPath: 'cover_thelittlemermaid.webp',
    readCount: 9767,
  },
  {
    bookTitle: '헨젤과 그레텔',
    bookPath: 'cover_hanselandgretel.webp',
    readCount: 6734,
  },
];

function BookReport({ bookData }: { bookData: ActivityHistoryInfo }) {
  return (
    <div className="flex flex-col justify-center items-center w-full py-3">
      <div className="w-[80%] mb-2">
        <img
          src={getCoverPath(bookData.bookPath)}
          alt={bookData.bookTitle}
          className="max-w-full aspect-[4/3]"
        />
      </div>
      <div className="text-xl">{bookData.bookTitle}</div>
      <div>
        총
        {' '}
        {bookData.readCount}
        회 읽었어요
      </div>
    </div>
  );
}

function ActivityTab() {
  // const {
  //   history,
  // } = useReportStore();
  // const readData = history.map((book) => <BookReport key={book.bookTitle} bookData={book} />);
  const readData = data.map((book) => <BookReport key={book.bookTitle} bookData={book} />);

  return (
    <div className="flex flex-col w-full h-full gap-y-5">
      <div className="text-xl">
        <span>
          {
            // history.length
            data.length
          ? (
            <div>
              {/* <span className="text-[steelblue]">{history[0].bookTitle}</span> */}
              <span className="text-[steelblue]">{data[0].bookTitle}</span>
              을(를) 가장 많이 읽었어요.
            </div>
          )
          : '아직 책을 읽지 않았어요'
}
        </span>
      </div>
      <div className="w-full h-full flex justify-center items-center bg-blue-100 border-4 border-blue-300 rounded-2xl font-sans font-bold p-4">
        <div className="w-full grid grid-cols-3 justify-evenly items-baseline">
          {readData}
        </div>
      </div>
    </div>
  );
}

export default ActivityTab;
