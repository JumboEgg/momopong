import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '@/components/auth/CustomInput';
import TextButton from '@/components/common/buttons/TextButton';
import useAuthStore from '@/stores/AuthStore';
import type { LoginRequest } from '@/stores/AuthStore';

// 유효성 검사를 위한 인터페이스
interface FormErrors {
  email?: string;
  password?: string;
}

function Login(): JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // 필요한 상태만 선택적으로 구독(불필요한 리렌더/무한루프 방지)
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const validateEmail = (email: string): string | undefined => {
    if (!email) return '이메일은 필수입니다';
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return '올바른 이메일 형식이어야 합니다';
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return '비밀번호는 필수입니다';
    return undefined;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 입력 중에는 에러 메시지를 지웁니다
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }
    if (name === 'password') {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 제출 시점에 모든 필드 다시 검증
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    // 새로운 에러 상태 설정
    setErrors({
      email: emailError,
      password: passwordError,
    });

    // 에러가 하나라도 있으면 제출하지 않음
    if (emailError || passwordError) {
      return;
    }

    try {
      await login(formData);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">동화가 가득한 세계,</h1>
          <h2 className="text-xl text-gray-600">동화누리에 오신 것을 환영합니다.</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <CustomInput
              label="이메일"
              type="email"
              name="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.email}
              required
            />
            <CustomInput
              label="비밀번호"
              type="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.password}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="pt-4">
            <TextButton
              size="lg"
              variant="blue"
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </TextButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
