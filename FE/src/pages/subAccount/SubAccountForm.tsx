import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useSubAccountStore from '@/stores/subAccountStore';
import useAuthStore from '@/stores/authStore';
import ImageUpload from '@/components/ImageUpload';
import TextButton from '@/components/common/buttons/TextButton';

interface SubAccountFormProps {
  mode?: 'create' | 'edit';
}

interface ValidationErrors {
  name?: string;
  birth?: string;
  gender?: string;
  profile?: string;
}

function SubAccountForm({ mode = 'create' }: SubAccountFormProps): JSX.Element {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const {
    formData,
    setFormField,
    createSubAccount,
    isLoading,
    error: storeError,
  } = useSubAccountStore();

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [localError, setLocalError] = useState<string | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsError, setTermsError] = useState<string>('');

  useEffect(() => {
    if (user?.parentId) {
      setFormField('parentId', user.parentId);
    }
  }, [user, setFormField]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = '이름을 입력해주세요';
    } else if (formData.name.length > 10) {
      errors.name = '이름은 10자 이내로 입력해주세요';
    }

    if (!formData.birth) {
      errors.birth = '생년월일을 선택해주세요';
    } else {
      const birthDate = new Date(formData.birth);
      const today = new Date();

      if (birthDate > today) {
        errors.birth = '올바른 생년월일을 선택해주세요';
      }
    }

    if (!formData.gender) {
      errors.gender = '성별을 선택해주세요';
    }

    if (formData.profile === '/images/default-profile.jpg') {
      errors.profile = '프로필 이미지를 선택해주세요';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormField(name, value);
    // 입력 시 해당 필드의 에러 메시지 제거
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (fileName: string) => {
    setFormField('profile', fileName);
    setValidationErrors((prev) => ({ ...prev, profile: undefined }));
  };

  const handleImageUploadStart = () => {
    setIsImageUploading(true);
  };

  const handleImageUploadComplete = () => {
    setIsImageUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // terms 체크 여부 확인
    if (!termsAgreed) {
      setTermsError('아이 정보 수집 및 이용에 동의해주세요');
      return;
    }

    if (isImageUploading) {
      setLocalError('이미지 업로드가 완료될 때까지 기다려주세요.');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      await createSubAccount(formData);
      navigate(`/parents/${user?.parentId}/children`);
    } catch (err) {
      if (err instanceof Error) {
        setLocalError(err.message);
      } else {
        setLocalError('계정 생성 중 오류가 발생했습니다');
      }
    }
  };

  // 체크박스 핸들러
const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setTermsAgreed(e.target.checked);
  if (e.target.checked) {
    setTermsError('');
  }
};

  const getButtonText = () => {
    if (isLoading) return '처리중...';
    if (mode === 'edit') return '수정';
    return '확인';
  };

  const handleCancel = () => {
    const confirmLeave = window.confirm('작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?');
    if (confirmLeave) {
      navigate(`/parents/${user?.parentId}/children`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pt-8">
      <h1 className="text-xl font-medium text-center mb-6">
        함께할 아이의 정보를 입력해주세요
      </h1>

      <div className="bg-white rounded-2xl p-8">
        {(storeError || localError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {storeError || localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex gap-8">
            <div className="w-48">
              <div className="relative">
                <ImageUpload
                  currentImage={formData.profile}
                  onImageChange={handleImageChange}
                  onUploadStart={handleImageUploadStart}
                  onUploadComplete={handleImageUploadComplete}
                />
                <span className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2 text-sm text-gray-500 whitespace-nowrap pr-2">
                  이미
                </span>
              </div>
              <div className="text-center">
                <span className="text-sm text-gray-500">미설정시</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <div className="text-sm mb-1">애칭</div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="이름을 입력하세요"
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="애칭"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <div className="text-sm mb-1">생년월일</div>
                <input
                  type="date"
                  name="birth"
                  value={formData.birth}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="생년월일"
                />
                {validationErrors.birth && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.birth}</p>
                )}
              </div>

              <div className="flex items-start pt-2">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={handleTermsChange}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  aria-label="약관 동의"
                />
                <div className="ml-3">
                  <span className="text-sm">
                    [필수] 아이 정보 수집 및 이용에 동의합니다
                  </span>
                  <p className="text-sm text-gray-500">
                    해당 정보는 컨텐츠 플레이를 위해서만 사용됩니다
                  </p>
                  {termsError && (
                    <p className="text-sm text-red-600">{termsError}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-center space-x-3 pt-4">
                <TextButton
                  type="button"
                  size="md"
                  variant="gray"
                  onClick={handleCancel}
                >
                  취소
                </TextButton>
                <TextButton
                  type="submit"
                  size="md"
                  variant="blue"
                  disabled={isLoading}
                >
                  {getButtonText()}
                </TextButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubAccountForm;
