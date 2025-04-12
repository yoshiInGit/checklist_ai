// メニューアイテムコンポーネント
interface MenuItemProps {
  icon: string;
  name: string;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, name, onClick }) => {
  return (
    <li 
      onClick={onClick}
      className="px-4 py-3 hover:bg-gray-100 transition-colors duration-200 cursor-pointer flex items-center space-x-3"
    >
      <span className="material-symbols-outlined text-gray-600">{icon}</span>
      <span className="text-gray-800 font-medium">{name}</span>
    </li>
  );
};

export default MenuItem;