import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '@/components/auth/CustomInput';
import TextButton from '@/components/common/buttons/TextButton';
import useAuthStore from '@/stores/authStore';
import { useLoginStore } from '@/stores/loginStore';
import type { LoginRequest } from '@/types/auth';

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

  const login = useLoginStore((state) => state.login);
  const isLoading = useLoginStore((state) => state.isLoading);
  const error = useLoginStore((state) => state.error);

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

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    try {
      await login(formData);
      setTimeout(() => {
        const { user } = useAuthStore.getState();
        if (user?.parentId) {
          navigate('/parents/:parent_id/children');
        } else {
          console.error('User data not available:', user);
        }
      }, 1000);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/login.jpeg')" }}
    >
      <div className="w-96 p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-[BMJUA] text-gray-900">모험 가득한 동화나라!</h1>
          <span className="text-2xl font-[BMJUA] text-tainoi-500">모모퐁</span>
          <span className="text-2xl font-[BMJUA] text-gray-900">에 오신 것을 환영합니다</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <div className="space-y-4">
            <CustomInput
              type="email"
              name="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.email}
              required
              className="max-w-[320px] h-12 rounded-xl bg-white"
            />
            <CustomInput
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.password}
              required
              className="max-w-[320px] h-12 rounded-xl bg-white"
            />
          </div>

          <div className="text-right">
            <button type="button" className="text-sm text-gray-600">
              비밀번호 찾기
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="pt-4 space-y-3">
            <TextButton
              size="lg"
              variant="blue"
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white rounded-lg py-3"
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </TextButton>

            <TextButton
              size="lg"
              variant="gray"
              onClick={() => navigate('/parents/signup')}
              className="w-full bg-gray-800 border-gray-800 text-white rounded-lg py-3"
            >
              회원가입
            </TextButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
