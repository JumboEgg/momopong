import { Routes, Route } from 'react-router-dom';
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
import MyBookStory from './components/myhouse/mybookstory/mybookstory';
import MyDrawing from './components/myhouse/mydrawing/mydrawing';
import MyLetters from './components/myhouse/letters/letters';

function App(): JSX.Element {
  return (
    // 추후 className에 touch-none overflow-hidden 설정시 스크롤이 방지됩니다
    <div className="fixed inset-0 overflow-auto">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/parents/login" element={<Login />} />
        <Route path="/parents/signup" element={<SignUp />} />
        <Route path="/parents/:parentId/children/*" element={<SubAccountPage />} />
        <Route path="/children/signup" element={<SubAccountForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/drawing" element={<Drawing />} />
        <Route path="/story/*" element={<Story />} />
        <Route path="/house" element={<MyHouse />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/parent" element={<Parent />} />
        <Route path="/test" element={<Test />} />
        <Route path="/house/letters" element={<MyLetters />} />
        <Route path="/house/mybookstory" element={<MyBookStory />} />
        <Route path="/house/mydrawing" element={<MyDrawing />} />
        <Route path="/sub-accounts/create" element={<SubAccountForm />} />
      </Routes>
    </div>
  );
}

export default App;
