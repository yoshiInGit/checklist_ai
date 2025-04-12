import { useEffect, useState } from 'react';
import { useLogin, useSignUp } from '../auth/sign';
import LoadingSpinner from './common/LoadingSpinner';

const AuthPage = () => {
  const [isLogin, setIsLogin]   = useState(true);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessages, setErrorMessages] = useState<string | null>(null);

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Reset form fields when switching modes
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessages(null);
  };

  // ログイン関係
  const {loading : loginLoading, error : loginError, login} = useLogin();
  useEffect(() => {
    if(loginError){
      setErrorMessages("パスワードが間違ってます");
    }
  }, [loginError]);

  //サインアップ関係
  const {loading: signupLoading, error : signupErr, signUp} = useSignUp();
  const isPasswordValid = (password: string): boolean => {
    if (password.length < 8) {
      return false;
    }
  
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
    return hasLowerCase && hasUpperCase && hasDigit && hasSymbol;
  }
  useEffect(()=>{
    if(signupErr){
      setErrorMessages("サインアップエラーが発生しました。");
    }
  },[signupErr])


  // ボタン機能
  const tryLoginOrSignUp = async () => {
    // ログインボタンが押された時の処理
    if (isLogin) {

      if(email === '' || password === '') {
        setErrorMessages('メールアドレスとパスワードを入力してください');
        return;
      }

      login(email, password);

    // サインアップ
    } else {
      // パスワードと確認用パスワードが一致しているかチェック
      if (password !== confirmPassword) {
        setErrorMessages('パスワードが一致しません');
        return;
      }

      if(isPasswordValid(password) == false) {
        setErrorMessages('パスワードは8文字以上で、大文字・小文字・数字・記号を含む必要があります');
        return;
      }

      signUp(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* 読み込み中 */}
      {(loginLoading || signupLoading) && <LoadingSpinner />}

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'ログイン' : 'アカウント作成'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または{' '}
            <button 
              onClick={toggleAuthMode} 
              className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
            >
              {isLogin ? '新規アカウントを作成' : 'ログインページに戻る'}
            </button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">

            <div>
              <label htmlFor="email-address" className="sr-only">
                メールアドレス
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="メールアドレス"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                パスワード
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="パスワード"
              />
            </div>
            {!isLogin && (
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  パスワード（確認）
                </label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="パスワード（確認）"
                />
              </div>
            )}
          
          </div>

          {errorMessages && <div className="w-full">
              <p className="text-red-500 text-sm font-bold">
                エラー：{errorMessages}
              </p>
          </div>}

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  パスワードを忘れた場合
                </a>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
              onClick={tryLoginOrSignUp}
            >
              {isLogin ? 'ログイン' : 'アカウント作成'}
            </button>
          </div>

          
        
        </form>
      </div>
    </div>
  );
};

export default AuthPage;