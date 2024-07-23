import { useState, useEffect } from 'react';

const useDeviceType = () => {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileDevices = [
            /android/i,
            /webos/i,
            /iphone/i,
            /ipad/i,
            /ipod/i,
            /blackberry/i,
            /windows phone/i
        ];

        setIsMobile(mobileDevices.some(device => userAgent.match(device)));
    }, []);

    return isMobile;
};

export default useDeviceType;
