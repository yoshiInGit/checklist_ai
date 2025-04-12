import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";

export class UserState {
    private static instance: UserState | null = null;

    user: User | null = null;

    onAuthStateChangedCallbacks: ((user: User | null) => void)[] = [];
  
    private constructor() {
      // コンストラクタはprivateにして、外部からのインスタンス化を防ぎます 
    }
  
    public static getInstance(): UserState {
      if (!UserState.instance) {
        UserState.instance = new UserState();
      }
      return UserState.instance;
    }

    subscribeAuthStateChange(callback: (user: User | null) => void) {
        this.onAuthStateChangedCallbacks.push(callback);
    }

    unsubscribeAuthStateChange(callback: (user: User | null) => void) {
        this.onAuthStateChangedCallbacks = this.onAuthStateChangedCallbacks.filter(
            (cb) => cb !== callback
        );
    }

    onAuthStateChangedCall() {
        console.log("onAuthStateChangedCall");
        this.onAuthStateChangedCallbacks.forEach((cb) => cb(this.user));
    }
  
    // シングルトンクラスのメソッドやプロパティをここに記述します
    public getUser(): User | null {
        return this.user;
    }

    public setUser(user: User | null): void {
        this.user = user;
    }
  }


  // ユーザーの認証状態を監視するFIrebaseの関数
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      UserState.getInstance().setUser(user);
      UserState.getInstance().onAuthStateChangedCall();
      // ...
    } else {
      // User is signed out
      // ...
      UserState.getInstance().setUser(null);
      UserState.getInstance().onAuthStateChangedCall();
    }
  });
  