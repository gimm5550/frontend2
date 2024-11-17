import GoogleMap from "../GoogleMap";
import CommonLayout from "./CommonLayout";
export default function GoogleMapLayout(){
    console.log("GoogleMapLayout 실행됨")
    return<div>
            <CommonLayout>
                <GoogleMap></GoogleMap>
            </CommonLayout>
        </div>
    
}