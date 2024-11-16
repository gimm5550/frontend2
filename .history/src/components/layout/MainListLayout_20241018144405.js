import FromServer from "../FromServer";
import MainList from "../MainList";
import CommonLayout from "./CommonLayout";
export default function MainListLayout(){
    return<div>
            <CommonLayout>
                <MainList></MainList>
            </CommonLayout>
        </div>
    
}