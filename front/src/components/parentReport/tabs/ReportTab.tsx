import DonutChart from '../components/DonutChart';

const MOCK_REPORT_DATA = {
  monthTime: 12345,
  storyReadTime: 123,
  storyTogetherTime: 456,
  drawingSingleTime: 345,
  drawingTogetherTime: 567,
  thisWeek: 345,
  lastWeek: 456,
};

export interface ReportTabProps {
  childName: string;
}

function ReportTab({ childName }: ReportTabProps) {
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
        <span className="text-[steelblue]">{MOCK_REPORT_DATA.monthTime}</span>
        {' '}
        여행했어요.
      </div>
      <div className="w-full h-full flex justify-evenly items-center bg-pink-100 border-4 border-pink-300 rounded-2xl font-sans font-bold">
        <div>
          <div className="text-xl">독서 시간</div>
          <DonutChart
            singleTime={MOCK_REPORT_DATA.storyReadTime}
            multiTime={MOCK_REPORT_DATA.storyTogetherTime}
          />
        </div>
        <div>
          <div className="text-xl">그린 시간</div>
          <DonutChart
            singleTime={MOCK_REPORT_DATA.drawingSingleTime}
            multiTime={MOCK_REPORT_DATA.drawingTogetherTime}
          />
        </div>
        <div>
          <div className="text-xl">평균 이용 시간</div>
          <div className="font-normal ps-5">
            <div>
              <div>이번주</div>
              <div>{MOCK_REPORT_DATA.thisWeek}</div>
            </div>
            <div>
              <div>지난주</div>
              <div>{MOCK_REPORT_DATA.lastWeek}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportTab;
