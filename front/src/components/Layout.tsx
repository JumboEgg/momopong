import { Outlet } from 'react-router-dom';

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        {/* <ul className="flex justify-between py-4 px-4">
          <li><Link to="/">홈</Link></li>
          <li><Link to="/drawing">그림그리기</Link></li>
          <li><Link to="/story">동화읽기</Link></li>
          <li><Link to="/house">나의집</Link></li>
          <li><Link to="/profile">프로필</Link></li>
          <li><Link to="/friends">친구관리</Link></li>
        </ul> */}
      </nav>
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
