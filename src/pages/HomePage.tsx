import { useState, useEffect, useRef} from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import ChecklistCards from './modules/ChecklistCards';
import ChecklistCreatorDialog from './modules/ChecklistCreatorDialog';
import MenuItem from './modules/MenuItems';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../auth/sign';
import LoadingSpinner from './common/LoadingSpinner';
import { User } from 'firebase/auth';
import { maskEmail } from '../helper/stringHandle';
import { UserState } from '../auth/user';

const HomePage = () => {
  const navigate = useNavigate();


  // ユーザー情報関係
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    //ページ遷移後用に
    setUser(UserState.getInstance().getUser());

    //ユーザー状態監視
    const onUserAuthChange = (user: User | null) => {
      setUser(user);
    };

    UserState.getInstance().subscribeAuthStateChange(onUserAuthChange);

    return () => {
      UserState.getInstance().unsubscribeAuthStateChange(onUserAuthChange);
    };

  }, []);


  const checkUserLogin = async()=>{
    const user = await UserState.getInstance().getUser()
    if(!user){
        navigate("/auth")
    }
  }


  // ログアウト関係
  const {logout, loading: logoutLoading} = useLogout();


  // ダイアログ関係
  const [isChecklistCreatorDialogOpen, setIsChecklistCreatorDialogOpen] = useState(false);



  // メニュー関係
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // ハンバーガーメニューの開閉処理
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // オーバーレイのクリックでメニューを閉じる処理
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // 外部クリックでメニューを閉じる処理
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                overlayRef.current &&
                !overlayRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ウィンドウサイズ変更時の処理
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMenuOpen]);


    return (
        <div className="min-h-screen bg-gray-100">
            {/* ヘッダーバー */}
            <header
                className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-800 text-white h-14 flex items-center z-10 shadow-md"
            >
                {/* ハンバーガーメニュー */}
                <button
                    onClick={toggleMenu}
                    className="pl-2 flex flex-col justify-between w-7 cursor-pointer"
                    aria-label="メニューを開く"
                >
                    <span className="material-symbols-outlined text-8xl" style={{ fontSize: '2.2rem' }}>
                      menu
                    </span>
                </button>

                {/* サイトタイトル */}
                <div className="text-lg ml-8 font-bold mr-4">CheckList ai</div>

                <div className="grow"></div>

                {/* ユーザー表示 */}
                {(user == null) && <div className="text-lg mr-6 font-bold cursor-pointer hover:bg-gray-950/20 h-4/5 flex items-center px-2 rounded transition duration-500 ease-in-out"
                     onClick={() => navigate('/auth')}>
                  Login
                </div>}

                {user && <div className="text-lg mr-6 font-bold cursor-pointer hover:bg-gray-950/20 h-4/5 flex items-center px-2 rounded transition duration-500 ease-in-out"
                  >
                    {maskEmail(user.email ?? "")}
                </div>}


                {/* デスクトップ用メニュー */}
                <nav className="hidden md:flex">
                    {/* ここにメニュー項目が入ります */}
                </nav>
            </header>

            {/* サイドメニュー（モバイル用） */}
            <motion.nav
                ref={menuRef}
                initial={{ x: '-100%' }}
                animate={{ x: isMenuOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className="fixed top-0 left-0 w-80 h-full bg-gray-50 shadow-lg z-50 overflow-y-auto"
            >
                <div className="w-full h-40 bg-gradient-to-r mb-4 flex items-center justify-center from-blue-500 to-blue-600">
                </div>

                <MenuItem icon={'logout'} name={'ログアウト'} onClick={function (): void {
                  logout();
                } } />

            </motion.nav>

            {/* オーバーレイ */}
            {isMenuOpen && (
                <div
                    ref={overlayRef}
                    onClick={closeMenu}
                    className="fixed top-0 left-0 w-full h-full bg-black/70 bg-opacity-50 z-40"
                    aria-hidden="true"
                />
            )}

            {/* メインコンテンツエリア */}
            <main className="pt-20 p-4 min-h-[calc(100vh-80px)]">
                <ChecklistCards/>

                {/* ダイアログ */}
                  {/* 入力欄 */}
                {isChecklistCreatorDialogOpen && <ChecklistCreatorDialog onClose={() => setIsChecklistCreatorDialogOpen(false)} />}
            </main>

            {/* フローティングアクションボタン */}
            <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9, y: 0 }}
                className="fixed bottom-5 right-5 w-18 h-18 rounded-full bg-gradient-to-r from-blue-500 to-blue-800 text-white text-4xl shadow-lg z-50
                           flex items-center justify-center transition-normal duration-100 cursor-pointer"
                onClick={() => {checkUserLogin(); setIsChecklistCreatorDialogOpen(true)}} // アクション
                aria-label="新しいコンテンツを追加"
            >
                <Plus size={36}/>
            </motion.button>


            {/* ダイアログ */}
            {logoutLoading && <LoadingSpinner />}
        </div>
      );
}

export default HomePage;