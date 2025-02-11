import { IconCircleButton } from '@/components/common/buttons/CircleButton';
import ActivityTab from '@/components/parentReport/tabs/ActivityTab';
import CraftsTab from '@/components/parentReport/tabs/CraftsTab';
import ReportTab from '@/components/parentReport/tabs/ReportTab';
import { useReportStore } from '@/stores/reportStore';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import '@/components/common/scrollbar.css';
import useSubAccountStore from '@/stores/subAccountStore';

function Parent() {
  const navigate = useNavigate();
  const {
    subAccounts,
  } = useSubAccountStore();

  const {
    childIdx, setChildIdx, reportTab, setReportTab,
  } = useReportStore();

  const content = (): JSX.Element => {
    if (reportTab === 'report') {
      return (
        <ReportTab childName={subAccounts[childIdx].name} />
      );
    }

    if (reportTab === 'activities') {
      return (
        <ActivityTab />
      );
    }

    return (
      <CraftsTab childId={subAccounts[childIdx].childId} childName={subAccounts[childIdx].name} />
    );
  };

  return (
    <div className="w-screen h-screen relative bg-pink-200 flex font-[BMJUA]">
      <div className="absolute top-5 left-5">
        <IconCircleButton
          size="sm"
          variant="action"
          className=""
          onClick={() => navigate('/parents/:parent_id/children')}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="sm" />}
        />
      </div>
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="w-[80%] max-w-4xl min-w-xl h-[80%] max-h-xl flex flex-col">
          {/* 리포트 제목 */}
          <div
            className="text-2xl md:text-4xl lg:text-5xl mb-1 md:mb-4"
            style={{
              textShadow: '2px 2px 0px white, -2px -2px 0px white, -2px 2px 0px white, 2px -2px 0px white',
            }}
          >
            아이 활동 리포트
          </div>
          {/* 리포트 전체 영역 */}
          <div className="bg-white rounded-2xl min-h-xl max-h-[90%] flex-1 flex flex-col px-4 md:px-10 py-3 md:py-5">
            {/* 아이 선택 탭 */}
            <div className="flex flex-row mb-5">
              {subAccounts.map((child, idx) => (
                <button
                  key={subAccounts[idx].childId}
                  type="button"
                  onClick={() => setChildIdx(idx)}
                  className="text-xl md:text-2xl mr-5 md:mr-10"
                  style={{
                    color: childIdx === idx ? 'steelblue' : 'cornflowerblue',
                  }}
                >
                  {child.name}
                </button>
              ))}
            </div>
            <div className="flex flex-row flex-1 min-h-0">
              {/* 아이 프로필 영역 */}
              <div className="flex flex-col flex-1 items-center space-y-0 sm:space-y-1 md:space-y-2 pe-2 md:pe-5">
                <div className="w-[80%] min-w-20 hidden sm:block">
                  <img
                    src={subAccounts[childIdx].profile}
                    alt={subAccounts[childIdx].name}
                    className="w-full aspect-square rounded-full bg-amber-300"
                  />
                </div>
                <div className="text-xl md:text-2xl lg:text-3xl">{subAccounts[childIdx].name}</div>
                <div className="text-sm sm:text-lg md:text-xl">
                  {subAccounts[childIdx].age}
                  세
                </div>
                <div className="text-sm sm:text-lg md:text-xl">
                  가입 후
                  {' '}
                  {subAccounts[childIdx].daysSinceStart}
                  일
                </div>
              </div>
              <div className="flex-3 min-w-0 flex flex-col">
                <div className="flex flex-row mb-2 md:mb-4">
                  <button
                    type="button"
                    onClick={() => setReportTab('report')}
                    className="text-xl md:text-2xl mr-5 md:mr-10"
                    style={{
                      color: reportTab === 'report' ? 'steelblue' : 'cornflowerblue',
                    }}
                  >
                    활동 분석
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportTab('activities')}
                    className="text-xl md:text-2xl mr-5 md:mr-10"
                    style={{
                      color: reportTab === 'activities' ? 'steelblue' : 'cornflowerblue',
                    }}
                  >
                    활동 내역
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportTab('crafts')}
                    className="text-xl md:text-2xl mr-5 md:mr-10"
                    style={{
                      color: reportTab === 'crafts' ? 'steelblue' : 'cornflowerblue',
                    }}
                  >
                    아이의 작품
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto customScrollbar">
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
