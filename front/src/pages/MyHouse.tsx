import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyHouse() {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<'letter' | 'frame' | 'book' | null>(null);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/images/house-background.png')" }}
    >
      {/* 편지 이미지 */}
      <button
        type="button"
        className={`
        absolute cursor-pointer transition-all duration-300
        ${hoveredItem === 'letter' ? 'scale-110' : ''}
      `}
        style={{
          left: '13%',
          top: '50%',
          width: '150px',
          height: '150px',
          background: 'transparent',
          border: 'none',
        }}
        onClick={() => navigate('/house/letters')}
        onMouseEnter={() => setHoveredItem('letter')}
        onMouseLeave={() => setHoveredItem(null)}
        aria-label="내가 받은 편지함으로 이동"
      >
        <img src="/images/letter-icon.png" alt="편지함" className="w-full h-full object-contain" />
        {hoveredItem === 'letter' && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg">
            <p className="text-sm whitespace-nowrap">내가 받은 편지함</p>
          </div>
        )}
      </button>

      {/* 책장 이미지 */}
      <button
        type="button"
        className={`
         absolute cursor-pointer transition-all duration-300
         ${hoveredItem === 'book' ? 'scale-110' : ''}
       `}
        style={{
          left: '52%',
          top: '20%',
          transform: 'translateX(-50%)',
          background: 'transparent',
          border: 'none',
        }}
        onClick={() => navigate('/house/mybookstory')}
        onMouseEnter={() => setHoveredItem('book')}
        onMouseLeave={() => setHoveredItem(null)}
        aria-label="내가 읽은 동화 보기"
      >
        <img
          src="/images/bookshelf-icon.png"
          alt="책장"
          style={{
            width: '350px',
            height: '450px',
          }}
        />
        {hoveredItem === 'book' && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg">
            <p className="text-sm whitespace-nowrap">내가 읽은 동화</p>
          </div>
        )}
      </button>

      {/* 액자 이미지 */}
      <button
        type="button"
        className={`
        absolute cursor-pointer transition-all duration-300
        ${hoveredItem === 'frame' ? 'scale-110' : ''}
      `}
        style={{
          right: '15%',
          top: '20%',
          width: '150px',
          height: '150px',
          background: 'transparent',
          border: 'none',
        }}
        onClick={() => navigate('/house/mydrawing')}
        onMouseEnter={() => setHoveredItem('frame')}
        onMouseLeave={() => setHoveredItem(null)}
        aria-label="내가 그린 그림 갤러리로 이동"
      >
        <img src="/images/frame-icon.png" alt="그림 갤러리" className="w-full h-full object-contain" />
        {hoveredItem === 'frame' && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg">
            <p className="text-sm whitespace-nowrap">내가 그린 그림들</p>
          </div>
        )}
      </button>
    </div>
  );
}

export default MyHouse;
