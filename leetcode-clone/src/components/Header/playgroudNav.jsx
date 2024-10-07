import React, { useEffect, useState } from 'react';
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from 'react-icons/ai';

const PlaygroundNavbar = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleFullScreen = () => {
        if (isFullScreen) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
        setIsFullScreen(!isFullScreen);
    };

    useEffect(() => {
        function exitHandler(e) {
            if (!document.fullscreenElement) {
                setIsFullScreen(false);
                return;
            }
            setIsFullScreen(true);
        }

        if (document.addEventListener) {
            document.addEventListener("fullscreenchange", exitHandler);
            document.addEventListener("webkitfullscreenchange", exitHandler);
            document.addEventListener("mozfullscreenchange", exitHandler);
            document.addEventListener("MSFullscreenChange", exitHandler);
        }
    }, [isFullScreen]);

    return (
        <div className="playground-navbar">
            <button onClick={handleFullScreen}>
                {isFullScreen ? <AiOutlineFullscreenExit /> : <AiOutlineFullscreen />}
            </button>
            <button>
                <AiOutlineSetting />
            </button>
        </div>
    );
};

export default PlaygroundNavbar;
