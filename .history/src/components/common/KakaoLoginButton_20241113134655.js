import React from 'react';
import KakaoLogin from 'react-kakao-login';

const KakaoLoginButton = () => {
  const handleSuccess = (response) => {
    console.log("카카오 로그인 성공:", response);
    // 필요한 경우 서버로 토큰 전송
  };

  const handleFailure = (error) => {
    console.error("카카오 로그인 실패:", error);
  };

  return (
    <KakaoLogin
      token={"YOUR_KAKAO_JAVASCRIPT_KEY"} // JavaScript 키를 입력
      onSuccess={handleSuccess}
      onFail={handleFailure}
      render={(props) => (
        <button onClick={props.onClick} style={{ padding: '10px 20px', backgroundColor: '#FEE500', border: 'none', borderRadius: '5px', color: '#3C1E1E', fontSize: '16px' }}>
          카카오 로그인
        </button>
      )}
    />
  );
};

export default KakaoLoginButton;
