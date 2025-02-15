/* eslint-disable jsx-a11y/label-has-associated-control */
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useSubAccountStore from '@/stores/subAccountStore';
import useAuthStore from '@/stores/authStore';
import ImageUpload from '@/components/ImageUpload';
import TextButton from '@/components/common/buttons/TextButton';

interface ValidationErrors {
  name?: string;
  birth?: string;
  gender?: string;
  terms?: string;
  profile?: string;
}

function SubAccountForm(): JSX.Element {
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

  useEffect(() => {
    if (user?.parentId) {
      setFormField('parentId', user.parentId);
    }
  }, [user, setFormField]);

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!formData.name.trim()) {
      errors.name = '이름을 입력해주세요';
    }

    if (!formData.birth) {
      errors.birth = '생년월일을 선택해주세요';
    }

    if (!formData.gender) {
      errors.gender = '성별을 선택해주세요';
    }

    if (!formData.profile || formData.profile === '/images/default-profile.jpg') {
      errors.profile = '프로필 이미지를 선택해주세요';
    }

    if (!termsAgreed) {
      errors.terms = '[필수] 아이 정보 수집 및 이용에 동의해주세요';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e:
    React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormField(name, value);
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleImageChange = (fileName: string) => {
    setFormField('profile', fileName);
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

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAgreed(e.target.checked);
    setValidationErrors((prev) => ({ ...prev, terms: undefined }));
  };

  return (
    <div className="min-h-screen bg-sky-100 flex items-center justify-center relative p-4">
      <div className="w-4/5 h-[650px] bg-white rounded-3xl p-12">
        <h1 className="text-3xl font-bold font-[BMDOHYEON] text-center mb-12">
          함께할 아이의 정보를 입력해주세요
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-16">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-[400px] h-[400px] relative mb-4 bg-gray-50 rounded-2xl">
                <ImageUpload
                  currentImage={formData.profile}
                  onImageChange={handleImageChange}
                  onUploadStart={handleImageUploadStart}
                  onUploadComplete={handleImageUploadComplete}
                />
              </div>
              <p className="text-sm text-gray-500">미설정시 기본 프로필 사진으로 설정됩니다</p>
            </div>

            <div className="flex-1 space-y-8">
              <div>
                <label htmlFor="name" className="block text-base mb-2">애칭</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="애칭을 입력해주세요"
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-lg"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="birth" className="block text-base mb-2">생년월일</label>
                <input
                  id="birth"
                  type="date"
                  name="birth"
                  value={formData.birth}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-lg"
                />
                {validationErrors.birth && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.birth}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-base mb-2">성별</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-lg"
                >
                  <option value="">성별을 선택하세요</option>
                  <option value="남자">남자</option>
                  <option value="여자">여자</option>
                </select>
                {validationErrors.gender && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.gender}</p>
                )}
              </div>

              <div className="pt-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={handleTermsChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                  <div>
                    <p className="text-sm">[필수] 아이 정보 수집 및 이용에 동의합니다</p>
                    <p className="text-sm text-gray-500">해당 정보는 컨텐츠 플레이를 위해서만 사용됩니다.</p>
                    {validationErrors.terms && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.terms}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <TextButton
                  size="md"
                  variant="gray"
                  onClick={() => navigate(-1)}
                >
                  취소
                </TextButton>
                <TextButton
                  size="md"
                  variant="blue"
                  type="submit"
                  disabled={isLoading}
                >
                  확인
                </TextButton>
              </div>
            </div>
          </div>
        </form>

        {(storeError || localError) && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {storeError || localError}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubAccountForm;
