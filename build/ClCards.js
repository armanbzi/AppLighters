import React, { useState } from 'react';

export default function ClCards(props) {
    return (
<div>
    <a href={props.url} style={{textDecoration:"none"}}>
            <div className={"clientCard"}>

                <div className="clientCard_image"><img src={props.img}/></div>
                <div className="clientCard_title">
                    <p>{props.title}</p>
                </div>

            </div>
    </a>
</div>


    );
}