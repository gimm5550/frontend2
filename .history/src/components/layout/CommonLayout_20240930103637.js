import Footer from "../common/footer";

export default function CommonLayout({children}){
    return(
        <div>
            <Header></Header>
            {children}
            <Footer></Footer>
        </div>
    )
}