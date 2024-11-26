import Footer from "../common/Footer";
import Header from "../common/Header";
{/* <div>
            <Header></Header>
            {children}
            <Footer></Footer>
        </div> */}
export default function CommonLayout({children}){
    return <div>
            {children}
        </div>
    
}