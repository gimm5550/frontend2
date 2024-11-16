export default function LoginForm(){
    return (
        <div>
            <h1>로그인 페이지</h1>
            <div>
                <label htmlFor="username">아이디:</label>
                <input 
                    type="text" 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
            </div>
            <div>
                <label htmlFor="password">비밀번호:</label>
                <input 
                    type="password" 
                    id="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
            </div>
            <button onClick={handleLogin}>로그인</button>
            <button onClick={register}>회원가입</button>
        </div>
    );
}