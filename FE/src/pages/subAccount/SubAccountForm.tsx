import { useNavigate } from 'react-router-dom';
import useSubAccountStore from '@/stores/subAccountStore';
import ImageUpload from '@/components/ImageUpload';

interface SubAccountFormProps {
  mode?: 'create' | 'edit';
}

function SubAccountForm({ mode }: SubAccountFormProps): JSX.Element {
  const navigate = useNavigate();
  const {
    formData,
    setFormField,
    handleImageChange,
    createSubAccount,
    isLoading,
    error,
  } = useSubAccountStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createSubAccount(formData);
      navigate('/');
    } catch (err) {
      // 에러는 이미 store에서 처리됨
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {mode === 'create' ? '새 계정 만들기' : '계정 수정하기'}
      </h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center mb-6">
          <ImageUpload
            currentImage={formData.profile}
            onImageChange={handleImageChange}
          />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            성별
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="남자">남자</option>
              <option value="여자">여자</option>
            </select>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isLoading ? '처리중...' : '확인'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubAccountForm;
