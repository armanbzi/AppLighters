import lottie from "lottie-web";
import IndexSvg from "/public/svg/IndexSvg.json";
import React, { useState } from 'react';

export default function IndexSvgLoader() {
    React.useEffect(() => {
        lottie.loadAnimation({
            container: document.querySelector("#IndexSvg"),
            animationData: IndexSvg,
            autoplay: 'True',
        });
    }, []);
    return (
            <div id='IndexSvg'  style={{opacity:50+'%',width:100+'%',height:100+'%'}}/>
    );
}