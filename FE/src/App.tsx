import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import SubAccountPage from './pages/subAccount/SubAccountPage';
// import SubAccountForm from './pages/subAccount/SubAccountForm';
import Home from './pages/Home';
import Drawing from './pages/Drawing';
import Story from './pages/Story';
import MyHouse from './pages/MyHouse';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Parent from './pages/Parent';
import Test from './pages/Test';
import MyBookStory from './components/myhouse/mybookstory/mybookstory';
import MyDrawing from './components/myhouse/mydrawing/mydrawing';
import MyLetters from './components/myhouse/letters/letters';

// 추후 className에 touch-none overflow-hidden 설정시 스크롤이 방지됩니다
function App(): JSX.Element {
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
        {/* <Route
          path="/children/signup"
          element={(
            <ProtectedRoute>
              <SubAccountForm />
            </ProtectedRoute>
          )}
        /> */}
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
      </Routes>
    </div>
  );
}

export default App;
