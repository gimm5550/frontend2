import MainList from "../MainList";
import CommonLayout from "./CommonLayout";
export default function MainListLayout(){
    return<div>
            <CommonLayout mainlist={"mainlist"}>
                <MainList></MainList>
            </CommonLayout>
        </div>
    
}