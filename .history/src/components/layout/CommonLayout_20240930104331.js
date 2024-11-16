import Footer from "../common/Footer";
import Header from "../common/Header";
export default function CommonLayout({children}){
    return <div>
            <Header></Header>
            {children}
            <Footer></Footer>
        </div>
    
}