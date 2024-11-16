import FromServer from "../FromServer";
import RegisterForm from "../RegisterForm";
import UserDetail from "../UserDetail";
import CommonLayout from "./CommonLayout";

export default function RegisterFormLayout(){
    return<div>
            <CommonLayout>
                <RegisterForm></RegisterForm>
            </CommonLayout>
        </div>
    
}