interface ActivityTabProps {
  childName: string;
}

export interface ReadDataType {
  title: string;
  readCount: number;
  coverSrc: string;
}

const MOCK_READ_DATA: ReadDataType[] = [
  {
    title: '흥부와 놀부',
    readCount: 19,
    coverSrc: '/images/heungbu.jpg',
  },
  {
    title: '신데렐라',
    readCount: 12,
    coverSrc: '/images/cinderella.jpg',
  },
  {
    title: '견우와 직녀',
    readCount: 3,
    coverSrc: '/images/daily.jpg',
  },
];

function BookReport({ bookData }: { bookData: ReadDataType }) {
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="w-[80%] mb-2">
        <img
          src={bookData.coverSrc}
          alt={bookData.title}
          className="max-w-full"
        />
      </div>
      <div className="text-xl">{bookData.title}</div>
      <div>
        총
        {' '}
        {bookData.readCount}
        회 읽었어요
      </div>
    </div>
  );
}

function ActivityTab({ childName }: ActivityTabProps) {
  const readData = MOCK_READ_DATA.map((book) => <BookReport key={book.title} bookData={book} />);

  return (
    <div className="flex flex-col w-full h-full gap-y-5">
      <div className="text-2xl">
        이번 달,
        {' '}
        <span className="text-[cornflowerblue]">{childName}</span>
        {' '}
        어린이는
        <br />
        동화누리에서
        {' '}
        <span className="text-[steelblue]">
          {MOCK_READ_DATA[0].title}
          ,
          {' '}
          {MOCK_READ_DATA[1].title}
          ,
          {' '}
          {MOCK_READ_DATA[2].title}
        </span>
        을(를) 가장 많이 읽었어요.
      </div>
      <div className="w-full h-full flex justify-center items-center bg-blue-100 border-4 border-blue-300 rounded-2xl font-sans font-bold">
        <div className="w-full flex justify-evenly items-baseline">
          {readData}
        </div>
      </div>
    </div>
  );
}

export default ActivityTab;
