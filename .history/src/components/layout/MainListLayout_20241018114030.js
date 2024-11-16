import FromServer from "../FromServer";
import MainList from "../MainList";
import UserDetail from "../UserDetail";
import CommonLayout from "./CommonLayout";

export default function RegisterFormLayout(){
    return<div>
            <CommonLayout>
                <MainList></MainList>
            </CommonLayout>
        </div>
    
}