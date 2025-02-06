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
      const age = today.getFullYear() - birthDate.getFullYear();

      if (age > 13) {
        errors.birth = '13세 이하의 자녀만 등록할 수 있습니다';
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

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

  const getButtonText = () => {
    if (isLoading) return '처리중...';
    if (mode === 'edit') return '수정하기';
    return '생성하기';
  };

  const handleCancel = () => {
    const confirmLeave = window.confirm('작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?');
    if (confirmLeave) {
      navigate(`/parents/${user?.parentId}/children`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'create' ? '새 계정 만들기' : '계정 수정하기'}
      </h1>

      {(storeError || localError) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {storeError || localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center mb-6">
          <ImageUpload
            currentImage={formData.profile}
            onImageChange={handleImageChange}
          />
          {validationErrors.profile && (
            <p className="mt-2 text-sm text-red-600">{validationErrors.profile}</p>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            이름
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                ${validationErrors.name ? 'border-red-300' : 'border-gray-300'}`}
            />
          </label>
          {validationErrors.name && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="birth" className="block text-sm font-medium text-gray-700">
            생년월일
            <input
              id="birth"
              name="birth"
              type="date"
              required
              value={formData.birth}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                ${validationErrors.birth ? 'border-red-300' : 'border-gray-300'}`}
            />
          </label>
          {validationErrors.birth && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.birth}</p>
          )}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            성별
            <select
              id="gender"
              name="gender"
              required
              value={formData.gender}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 
                ${validationErrors.gender ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="남자">남자</option>
              <option value="여자">여자</option>
            </select>
          </label>
          {validationErrors.gender && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.gender}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6">
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
      </form>
    </div>
  );
}

export default SubAccountForm;
