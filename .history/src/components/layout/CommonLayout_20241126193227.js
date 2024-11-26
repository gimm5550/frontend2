import Footer from "../common/Footer";
import Header from "../common/Header";
import MenuBar from "../common/MenuBar"; // MenuBar 컴포넌트 추가
// <MenuBar />
export default function CommonLayout({ children }) {
  return (
    <div className="common-layout">
      <div className="main-content2" style={{width:"85%", margin:"0 auto", maxWidth: "720px", minWidth: "400px"}}>
        {children}
      </div>
    </div>
  );
}
