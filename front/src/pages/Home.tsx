import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 m-4">
      <div className="flex justify-center gap-4">
        <div onClick={() => navigate("/profile")} className="cursor-pointer flex flex-col items-center">
          <img src="/images/profileicon.png" alt="프로필" style={{ width: '50px', height: '50px' }} className="w-8 h-8 rounded-lg" />
          <p className="text-center text-xs">프로필</p>
        </div>
        <div onClick={() => navigate("/friends")} className="cursor-pointer flex flex-col items-center">
          <img src="/images/friendsicon.png" alt="친구목록" style={{ width: '50px', height: '50px' }} className="w-8 h-8 rounded-lg" />
          <p className="text-center text-xs">친구목록</p> 
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mb-2 flex-row">
        <div onClick={() => navigate("/drawing")} className="cursor-pointer flex flex-col items-center">
          <img src="/images/crayonicon.png" alt="그림그리기" style={{ width: '100px', height: '100px' }} className="w-12 h-12 rounded-lg" />
          <p className="text-center text-xs mt-1">그림그리기</p>
        </div>
        <div onClick={() => navigate("/story")} className="cursor-pointer flex flex-col items-center">
          <img src="/images/bookicon.png" alt="동화읽기" style={{ width: '100px', height: '100px' }} className="w-12 h-12 rounded-lg" />
          <p className="text-center text-xs mt-1">동화읽기</p>
        </div>
        <div onClick={() => navigate("/house")} className="cursor-pointer flex flex-col items-center">  
          <img src="/images/houseicon.png" alt="나의집" style={{ width: '100px', height: '100px' }} className="w-12 h-12 rounded-lg" />
          <p className="text-center text-xs mt-1">나의집</p>
        </div>
      </div>
      
      
    </div>
  );
};

export default HomePage;