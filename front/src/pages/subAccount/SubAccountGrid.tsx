// 프로필 선택 페이지
import useSubAccountStore from '@/stores/subAccountStore';
import ProfileImage from '@/components/common/ProfileImage';

interface SubAccountGridProps {
  onAdd: () => void;
}

function SubAccountGrid({ onAdd }: SubAccountGridProps): JSX.Element {
  const { subAccounts } = useSubAccountStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">서브 계정 선택</h1>
      <div className="grid grid-cols-3 gap-4">
        {subAccounts.map((account) => (
          <button
            key={account.id}
            type="button"
            className="aspect-square rounded-lg border-2 border-gray-200 p-4 flex flex-col items-center justify-center hover:border-blue-500"
          >
            <ProfileImage
              src={account.profile}
              alt={`${account.name}의 프로필`}
              size="lg"
              shape="circle"
              border
              className="mb-3"
            />
            <span className="font-medium text-gray-900">{account.name}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={onAdd}
          className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-blue-500"
        >
          <span className="text-4xl text-gray-400">+</span>
        </button>
      </div>
    </div>
  );
}

export default SubAccountGrid;
