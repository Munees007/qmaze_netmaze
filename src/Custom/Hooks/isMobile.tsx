import { useEffect, useState } from "react";

const useIsMobile = () =>{
    const [isMobile,setIsMobile] = useState<boolean>(false);
    useEffect(() => {
        const checkDeviceType = () => {
            setIsMobile(window.innerWidth <= 768); // Mobile threshold
        };
        checkDeviceType()
        window.addEventListener("resize", checkDeviceType);
        return () => window.removeEventListener("resize", checkDeviceType);
    },[]);

    return isMobile;
}

export default useIsMobile;