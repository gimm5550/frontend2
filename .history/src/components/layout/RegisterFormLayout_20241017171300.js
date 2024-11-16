import FromServer from "../FromServer";
import UserDetail from "../UserDetail";
import CommonLayout from "./CommonLayout";

export default function RegisterFormLayout(){
    return<div>
            <CommonLayout>
                <UserDetail></UserDetail>
            </CommonLayout>
        </div>
    
}