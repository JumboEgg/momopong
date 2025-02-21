import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconCircleButton, TextCircleButton } from '@/components/common/buttons/CircleButton';
import ActivityTab from '@/components/parentReport/tabs/ActivityTab';
import CraftsTab from '@/components/parentReport/tabs/CraftsTab';
import ReportTab from '@/components/parentReport/tabs/ReportTab';
import { useReportStore } from '@/stores/reportStore';
import { faArrowLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@/components/common/scrollbar.css';
import useSubAccountStore from '@/stores/subAccountStore';
import { useParentAuthStore } from '@/stores/parentAuthStore';
import { useLoginStore } from '@/stores/loginStore';

function Parent() {
  const navigate = useNavigate();
  const {
    subAccounts,
  } = useSubAccountStore();
  const { resetAuth } = useParentAuthStore();
  const { logout } = useLoginStore();

  const {
    childIdx, setChildIdx,
    reportTab, setReportTab,
    setAnalysis, setHistory, setBooks, setSketches, setLetters,
  } = useReportStore();

  // index 초기화
  useEffect(() => {
    setChildIdx(0);
    setReportTab('report');
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // 인증 관련 상태 초기화
  useEffect(() => () => {
      resetAuth();
    }, [resetAuth]);

  useEffect(() => {
    if (!subAccounts) return;
    setAnalysis(subAccounts[childIdx].childId);
    setHistory(subAccounts[childIdx].childId);
    setBooks(subAccounts[childIdx].childId);
    setSketches(subAccounts[childIdx].childId);
    setLetters(subAccounts[childIdx].childId);
  }, [childIdx]);

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
      <CraftsTab childName={subAccounts[childIdx].name} />
    );
  };

  return (
    <div className="w-screen h-screen relative bg-pink-200 flex font-[BMJUA]">
      <div className="absolute top-5 w-full px-5 flex justify-between">
        <IconCircleButton
          size="sm"
          variant="action"
          onClick={() => navigate('/parents/:parent_id/children')}
          icon={<FontAwesomeIcon icon={faArrowLeft} size="sm" />}
        />
        <TextCircleButton
          size="sm"
          variant="action"
          onClick={handleLogout}
          text="로그아웃"
          icon={<FontAwesomeIcon icon={faSignOutAlt} size="sm" />}
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
          <div className="bg-white rounded-2xl h-[calc(90%-50px)] sm:max-h-[500px] flex-1 flex flex-col px-4 md:px-10 py-3 md:py-5">
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
