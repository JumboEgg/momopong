import { Book, Palette } from 'lucide-react';
import DonutChart from '../components/DonutChart';

const MOCK_REPORT_DATA = {
  monthTime: 12345,
  storyReadTime: 123,
  storyTogetherTime: 456,
  drawingSingleTime: 345,
  drawingTogetherTime: 567,
  thisWeek: 345,
  lastWeek: 456,
  resignCnt: 3,
};

export interface ReportTabProps {
  childName: string;
}

function ReportTab({ childName }: ReportTabProps) {
  return (
    <div className="flex flex-col w-full h-full gap-y-2">
      <div className="text-xl">
        이번 달,
        {' '}
        <span className="text-[cornflowerblue]">{childName}</span>
        {' '}
        어린이는 모모퐁에서
        {' '}
        <span className="text-[steelblue]">{MOCK_REPORT_DATA.monthTime}</span>
        {' '}
        여행했어요.
      </div>
      <div className="w-full h-full flex flex-col justify-center items-center
        bg-pink-100 border-4 border-pink-300 rounded-2xl font-sans font-bold py-3 space-y-3"
      >
        <div className="w-full flex justify-evenly items-baseline">
          <div>
            <div className="text-xl flex items-center">
              <Book size={20} />
              독서 시간
            </div>
            <DonutChart
              singleTime={MOCK_REPORT_DATA.storyReadTime}
              multiTime={MOCK_REPORT_DATA.storyTogetherTime}
            />
          </div>
          <div>
            <div className="text-xl flex items-center">
              <Palette size={20} />
              그린 시간
            </div>
            <DonutChart
              singleTime={MOCK_REPORT_DATA.drawingSingleTime}
              multiTime={MOCK_REPORT_DATA.drawingTogetherTime}
            />
          </div>
          <div>
            <div className="text-xl">평균 이용 시간</div>
            <div className="font-normal ps-5 pt-2 space-y-2">
              <div>
                <div>이번주</div>
                <div
                  className="text-2xl ps-5 text-pink-400"
                >
                  {MOCK_REPORT_DATA.thisWeek}
                </div>
              </div>
              <div>
                <div>지난주</div>
                <div
                  className="text-2xl ps-5 text-blue-400"
                >
                  {MOCK_REPORT_DATA.lastWeek}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          멀티플레이 중 중도퇴장 횟수:
          {' '}
          {MOCK_REPORT_DATA.resignCnt}
        </div>
      </div>
    </div>
  );
}

export default ReportTab;
