import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '@/components/auth/CustomInput';
import TextButton from '@/components/common/buttons/TextButton';
import useAuthStore from '@/stores/AuthStore';

function LoginForm(): JSX.Element {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, password);
    navigate('/home');
  };

  return (
    <div>
      <div>
        <h1>동화가 가득한 세계,</h1>
        <h2>동화누리에 오신 것을 환영합니다.</h2>
      </div>
      {/* input */}
      <form onSubmit={handleSubmit}>
        <CustomInput
          label="아이디"
          type="text"
          placeholder="아이디를 입력하세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <CustomInput
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <TextButton
          size="lg"
          variant="blue"
          type="submit"
        >
          로그인
        </TextButton>
      </form>
    </div>
  );
}

export default LoginForm;
