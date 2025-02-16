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
    <div className="min-h-screen bg-sky-100 flex items-center justify-center p-4">
      {/* 컨테이너 크기와 패딩 조정 */}
      <div className="w-[95%] md:w-[90%] lg:w-4/5
        bg-white rounded-3xl
        p-4 sm:p-6 md:p-8
      "
      >
        <h1 className="text-xl sm:text-2xl md:text-3xl font-[BMJUA] text-center mb-4 sm:mb-6">
          함께할 아이의 정보를 입력해주세요
        </h1>

        <form onSubmit={handleSubmit}>
          {/* gap 축소 및 정렬 조정 */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-8">
            {/* 이미지 업로드 영역 */}
            <div className="md:w-1/2 flex flex-col items-center">
              <div className="w-full max-w-[250px] md:max-w-[300px] lg:max-w-[350px]
                aspect-square relative mb-2
                bg-gray-50 rounded-2xl
              "
              >
                <ImageUpload
                  currentImage={formData.profile}
                  onImageChange={handleImageChange}
                  onUploadStart={handleImageUploadStart}
                  onUploadComplete={handleImageUploadComplete}
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 md:mb-0">
                미설정시 기본 프로필 사진으로 설정됩니다
              </p>
            </div>

            {/* 폼 입력 영역 - 간격 축소 */}
            <div className="md:w-1/2 space-y-3 sm:space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm sm:text-base mb-1">애칭</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="애칭을 입력해주세요"
                  className="w-full h-10 px-4 rounded-xl border border-gray-200 bg-gray-50 text-base"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="birth" className="block text-sm sm:text-base mb-1">생년월일</label>
                <div className="flex gap-2">
                  <select
                    name="year"
                    value={formData.birth ? new Date(formData.birth).getFullYear() : ''}
                    onChange={(e) => {
                      const year = e.target.value;
                      const date = formData.birth ? new Date(formData.birth) : new Date();
                      date.setFullYear(Number(year));
                      setFormField('birth', date.toISOString().split('T')[0]);
                    }}
                    className="flex-1 h-10 px-4 rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <option value="">년도</option>
                    {Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - i)
                    .map((year) => (
                      <option key={year} value={year}>
                        {year}
                        년
                      </option>
                    ))}
                  </select>
                  <select
                    name="month"
                    value={formData.birth ? new Date(formData.birth).getMonth() + 1 : ''}
                    onChange={(e) => {
                      const month = e.target.value;
                      const date = formData.birth ? new Date(formData.birth) : new Date();
                      date.setMonth(Number(month) - 1);
                      setFormField('birth', date.toISOString().split('T')[0]);
                    }}
                    className="flex-1 h-10 px-4 rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <option value="">월</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {month}
                        월
                      </option>
                    ))}
                  </select>
                  <select
                    name="day"
                    value={formData.birth ? new Date(formData.birth).getDate() : ''}
                    onChange={(e) => {
                      const day = e.target.value;
                      const date = formData.birth ? new Date(formData.birth) : new Date();
                      date.setDate(Number(day));
                      setFormField('birth', date.toISOString().split('T')[0]);
                    }}
                    className="flex-1 h-10 px-4 rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <option value="">일</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                        일
                      </option>
                    ))}
                  </select>
                </div>
                {validationErrors.birth && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.birth}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm sm:text-base mb-1">성별</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                  className="w-full h-10 px-4 rounded-xl border border-gray-200 bg-gray-50 text-base"
                >
                  <option value="">성별을 선택하세요</option>
                  <option value="남자">남자</option>
                  <option value="여자">여자</option>
                </select>
                {validationErrors.gender && (
                  <p className="mt-1 text-xs text-red-600">{validationErrors.gender}</p>
                )}
              </div>

              {/* 약관 동의 영역 - 간격 축소 */}
              <div className="pt-2">
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={handleTermsChange}
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                  <div>
                    <p className="text-xs sm:text-sm">[필수] 아이 정보 수집 및 이용에 동의합니다</p>
                    <p className="text-xs text-gray-500">해당 정보는 컨텐츠 플레이를 위해서만 사용됩니다.</p>
                    {validationErrors.terms && (
                      <p className="mt-1 text-xs text-red-600">{validationErrors.terms}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 버튼 영역 */}
              <div className="flex justify-center space-x-4 pt-2">
                <TextButton size="sm" variant="gray" onClick={() => navigate(-1)}>
                  취소
                </TextButton>
                <TextButton size="sm" variant="blue" type="submit" disabled={isLoading}>
                  확인
                </TextButton>
              </div>
            </div>
          </div>
        </form>

        {(storeError || localError) && (
          <div className="mt-3 p-2 bg-red-100 text-red-700 rounded-md text-xs">
            {storeError || localError}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubAccountForm;
