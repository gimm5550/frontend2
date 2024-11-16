import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 로그인한 사용자 정보를 저장할 상태

    const login = (userData) => {
        setUser(userData); // 로그인 시 사용자 정보 저장
    };

    const logout = () => {
        setUser(null); // 로그아웃 시 사용자 정보 초기화
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 사용자 정보를 가져오는 커스텀 훅
export const useAuth = () => {
    return useContext(AuthContext);
};
