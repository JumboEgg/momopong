import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useSignUpStore from '@/stores/signUpStore';
import useLoginStore from '@/stores/loginStore';
import CustomInput from '@/components/auth/CustomInput';
import TextButton from '@/components/common/buttons/TextButton';
import type { SignUpFormData } from '@/stores/signUpStore';

interface FormErrors {
  email?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  phone?: string;
}

function SignUp(): JSX.Element {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    password: '',
    passwordConfirm: '',
    name: '',
    phone: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const { register, isLoading, error } = useSignUpStore();
  const isAuthenticated = useLoginStore((state) => state.isAuthenticated);

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
    // 비밀번호 유효성 검증
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다';
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return '비밀번호는 영문 대소문자, 숫자, 특수문자를 모두 포함해야 합니다';
    }

    return undefined;
  };

  const validatePasswordConfirm = (passwordConfirm: string): string | undefined => {
    if (!passwordConfirm) return '비밀번호 확인은 필수입니다';
    if (passwordConfirm !== formData.password) {
      return '비밀번호가 일치하지 않습니다';
    }
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name) return '이름은 필수입니다';
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return '연락처는 필수입니다';
    // 숫자와 하이픈만 남기고 모두 제거
    const cleanedPhone = phone.replace(/[^0-9-]/g, '');
    // 숫자만 추출
    const numbers = cleanedPhone.replace(/-/g, '');

    if (numbers.length !== 11) {
      return '올바른 연락처 형식이어야 합니다';
    }
    return undefined;
  };

  // 핸들러 함수
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // 숫자만 추출
      const numbers = value.replace(/[^0-9]/g, '');
      // 사용자가 숫자만 입력하더라도 자동으로 하이픈 추가되도록 합니다
      const formatted = numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 입력 필드별 검증 함수 매핑
    const validation = {
      email: () => validateEmail(value),
      password: () => validatePassword(value),
      passwordConfirm: () => validatePasswordConfirm(value),
      name: () => validateName(value),
      phone: () => validatePhone(value),
    };

    // 해당 필드의 검증 함수가 있으면 실행
    if (name in validation) {
      setErrors((prev) => ({
        ...prev,
        [name]: validation[name as keyof typeof validation](),
      }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      name: validateName(formData.name),
      phone: validatePhone(formData.phone),
    };

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((validationError) => validationError !== undefined)) {
      return;
    }

    try {
      await register(formData);
    } catch (err) {
      console.error('회원가입 실패:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <CustomInput
              label="이름"
              type="text"
              name="name"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.name}
              required
            />
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
            <CustomInput
              label="비밀번호 확인"
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호를 다시 입력하세요"
              value={formData.passwordConfirm}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.passwordConfirm}
              required
            />
            <CustomInput
              label="연락처"
              type="tel"
              name="phone"
              placeholder="휴대폰 번호를 입력하세요"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.phone}
              required
            />
          </div>
          <div className="pt-4">
            <TextButton
              size="lg"
              variant="blue"
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? '회원가입 중...' : '회원가입'}
            </TextButton>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?
          {' '}
          <Link to="/parents/login" className="text-blue-600 hover:underline">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
