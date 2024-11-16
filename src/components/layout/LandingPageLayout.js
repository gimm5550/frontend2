import FromServer from "../FromServer";
import CommonLayout from "./CommonLayout";

export default function LandingPageLayout(){
    return<div>
            <CommonLayout>
                <FromServer></FromServer>
            </CommonLayout>
        </div>
    
}