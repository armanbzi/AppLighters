import IndexSvg from "/public/svg/IndexSvg.json";
import React, { useState } from 'react';

export default function IndexSvgLoader() {
    React.useEffect(() => {
        let anim;
        import("lottie-web").then(({ default: lottie }) => {
            anim = lottie.loadAnimation({
                container: document.querySelector("#IndexSvg"),
                animationData: IndexSvg,
                autoplay: 'True',
            });
        });
        return () => anim && anim.destroy();
    }, []);
    return (
            <div id='IndexSvg'  style={{opacity:50+'%',width:100+'%',height:100+'%'}}/>
    );
}