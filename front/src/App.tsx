import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Home from './pages/Home'
import Drawing from './pages/Drawing'
import Story from './pages/Story'
import MyHouse from './pages/MyHouse'
import Profile from './pages/Profile'
import Friends from './pages/Friends'


const App = (): JSX.Element => {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="drawing" element={<Drawing />} />
          <Route path="story/*" element={<Story />} />
          <Route path="house" element={<MyHouse />} />
          <Route path="profile" element={<Profile />} />
          <Route path="friends" element={<Friends />} />
        </Route>
      </Routes>
  );
};

export default App;