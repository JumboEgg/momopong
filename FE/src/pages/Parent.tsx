import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import ActivityTab from '@/components/parentReport/tabs/ActivityTab';
import CraftsTab from '@/components/parentReport/tabs/CraftsTab';
import ReportTab from '@/components/parentReport/tabs/ReportTab';
import { useReportStore } from '@/stores/reportStore';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

function Parent() {
  const navigate = useNavigate();

  const {
    childIdx, setChildIdx, reportTab, setReportTab,
  } = useReportStore();

  const MOCK_CHILDREN_DATA = [
    {
      childId: 1,
      childName: '박치킨',
      childAge: 7,
      joinDate: 45,
      profileSrc: 'public/images/coloringTemplates/03/backgroundImg.png',
    },
    {
      childId: 2,
      childName: '박초코',
      childAge: 8,
      joinDate: 145,
      profileSrc: 'public/images/coloringTemplates/04/backgroundImg.png',
    },
    {
      childId: 3,
      childName: '박사탕',
      childAge: 17,
      joinDate: 2045,
      profileSrc: 'public/images/coloringTemplates/02/backgroundImg.png',
    },
  ];

  const content = (): JSX.Element => {
    if (reportTab === 'report') {
      return (
        <ReportTab childName={MOCK_CHILDREN_DATA[childIdx].childName} />
      );
    }

    if (reportTab === 'activities') {
      return (
        <ActivityTab childName={MOCK_CHILDREN_DATA[childIdx].childName} />
      );
    }

    return (
      <CraftsTab childName={MOCK_CHILDREN_DATA[childIdx].childName} />
    );
  };

  return (
    <div className="w-full h-full relative bg-pink-200 flex font-[BMJUA]">
      <div className="absolute top-5 left-5">
        <IconCircleButton
          size="sm"
          variant="action"
          className=""
          onClick={() => navigate('/sub-account')}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="sm" />}
        />
      </div>
      {/* 리포트 영역 */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="w-[80%] max-w-4xl min-w-3xl h-[80%] flex flex-col">
          <div
            className="text-5xl mb-4"
            style={{
              textShadow: '2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white',
            }}
          >
            아이 활동 리포트
          </div>
          <div className="bg-white rounded-2xl flex-1 overflow-hidden flex flex-col p-10">
            <div className="flex flex-row mb-5">
              {MOCK_CHILDREN_DATA.map((child, idx) => (
                <button
                  key={MOCK_CHILDREN_DATA[idx].childId}
                  type="button"
                  onClick={() => setChildIdx(idx)}
                  className="text-2xl mr-10"
                  style={{
                    color: childIdx === idx ? 'steelblue' : 'cornflowerblue',
                  }}
                >
                  {child.childName}
                </button>
              ))}
            </div>
            <div className="flex flex-row flex-1 min-h-0">
              <div className="flex-none w-64 flex flex-col items-center space-y-2 pe-5">
                <div className="w-[50%] min-w-40">
                  <img
                    src={MOCK_CHILDREN_DATA[childIdx].profileSrc}
                    alt={MOCK_CHILDREN_DATA[childIdx].childName}
                    className="w-full aspect-square rounded-full bg-amber-300"
                  />
                </div>
                <div className="text-3xl">{MOCK_CHILDREN_DATA[childIdx].childName}</div>
                <div className="text-xl">
                  {MOCK_CHILDREN_DATA[childIdx].childAge}
                  세
                </div>
                <div className="text-xl">
                  가입 후
                  {' '}
                  {MOCK_CHILDREN_DATA[childIdx].joinDate}
                  일
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex flex-row mb-5">
                  <button
                    type="button"
                    onClick={() => setReportTab('report')}
                    className="text-2xl mr-10"
                    style={{
                      color: reportTab === 'report' ? 'steelblue' : 'cornflowerblue',
                    }}
                  >
                    활동 분석
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportTab('activities')}
                    className="text-2xl mr-10"
                    style={{
                      color: reportTab === 'activities' ? 'steelblue' : 'cornflowerblue',
                    }}
                  >
                    활동 내역
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportTab('crafts')}
                    className="text-2xl mr-10"
                    style={{
                      color: reportTab === 'crafts' ? 'steelblue' : 'cornflowerblue',
                    }}
                  >
                    아이의 작품
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {content()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Parent;
