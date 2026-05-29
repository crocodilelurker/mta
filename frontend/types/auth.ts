export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'vendor' | 'admin'; // strict literal union types
    address: string;
    phoneNumber: string;
    orders: string[];
    cart: string[];
    whishlist: string[];
    shops: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}


export interface AuthMeResponse {
    status: "success" | "error",
    message: string,
    data: {
        isSignedIn: boolean,
        user: UserProfile | null
    }
}

export interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    loading: boolean;
    logout: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}