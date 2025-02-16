import { Routes, Route } from 'react-router-dom'; // Router 제거
// import ToastMessage from '@/components/common/Toast';
import ToastContainer from '@/components/common/ToastContainer';
import { useFirebaseMessaging } from './hooks/useFirebaseMessaging';

// 보호된 라우트
import ProtectedRoute from './components/ProtectedRoute';

// 페이지 컴포넌트들
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import SubAccountPage from './pages/subAccount/SubAccountPage';
import SubAccountForm from './pages/subAccount/SubAccountForm';
import Home from './pages/Home';
import Drawing from './pages/Drawing';
import Story from './pages/Story';
import MyHouse from './pages/MyHouse';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Parent from './pages/Parent';
import Test from './pages/Test';
import MyBookStory from './components/myhouse/mybookstory';
import MyDrawing from './components/myhouse/mydrawing';
import MyLetters from './components/myhouse/myletters';
import LetterPage from './components/stories/StoryMode/LetterPage';
import TogetherMode from './components/stories/StoryMode/TogetherMode';
import FriendSelection from './pages/FriendSelection';

// 모달 컴포넌트
import DialogModal from './components/common/modals/DialogModal';

function App(): JSX.Element {
  // 토스트 알림 추가할시 활성화하여 사용
  // const { toast } = useFirebaseMessaging();

  const {
    invitationModal,
    handleInvitationAccept,
    handleInvitationReject,
  } = useFirebaseMessaging();

  return (
    <div className="fixed inset-0 overflow-auto">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/parents/login"
          element={(
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/parents/signup"
          element={(
            <ProtectedRoute requireAuth={false}>
              <SignUp />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/test"
          element={(
            <ProtectedRoute requireAuth={false}>
              <Test />
            </ProtectedRoute>
          )}
        />

        {/* Protected Routes */}
        <Route
          path="/parents/:parent_id/children/*"
          element={(
            <ProtectedRoute>
              <SubAccountPage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/parents/:parent_id/children/signup"
          element={(
            <ProtectedRoute>
              <SubAccountForm />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/home"
          element={(
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/drawing"
          element={(
            <ProtectedRoute>
              <Drawing />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/story/*"
          element={(
            <ProtectedRoute>
              <Story />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/house"
          element={(
            <ProtectedRoute>
              <MyHouse />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/profile"
          element={(
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/friends"
          element={(
            <ProtectedRoute>
              <Friends />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/friend-selection"
          element={(
            <ProtectedRoute>
              <FriendSelection />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/parent"
          element={(
            <ProtectedRoute>
              <Parent />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/house/letters"
          element={(
            <ProtectedRoute>
              <MyLetters />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/house/mybookstory"
          element={(
            <ProtectedRoute>
              <MyBookStory />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/house/mydrawing"
          element={(
            <ProtectedRoute>
              <MyDrawing />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/book/letter"
          element={(
            <ProtectedRoute>
              <LetterPage />
            </ProtectedRoute>
          )}
        />

        {/* 동화 같이읽기 라우팅, 필요시 수정하여 사용 */}
        <Route
          path="/book/:bookId/together"
          element={(
            <ProtectedRoute>
              <TogetherMode />
            </ProtectedRoute>
          )}
        />

      </Routes>

      {invitationModal.isOpen && invitationModal.data && (
      <DialogModal
        type="confirm"
        message1={`${invitationModal.data.inviterName}이(가)`}
        message2={
      invitationModal.data.contentType === 'BOOK'
        ? `${invitationModal.data.contentTitle}을(를) 같이 읽고 싶어해요`
        : `${invitationModal.data.contentTitle}을(를) 같이 그리고 싶어해요`
    }
        onConfirm={handleInvitationAccept}
        onClose={handleInvitationReject}
      />
)}
      <ToastContainer />
    </div>
  );
}

export default App;
