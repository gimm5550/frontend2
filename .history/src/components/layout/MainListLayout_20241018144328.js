import FromServer from "../FromServer";
import UserDetail from "../UserDetail";
import MainListLayout from "./MainListLayout";
import CommonLayout from "./CommonLayout";
export default function MainListLayout(){
    return<div>
            <CommonLayout>
                <MainList></MainList>
            </CommonLayout>
        </div>
    
}