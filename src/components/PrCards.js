import React from 'react';

export default function PrCards(props) {
    const frs = props.frameWorks;
    return (
        <div>
            <section>
                <div className="container">
                    <div className="card">
                        <a style={{textDecoration: 'none'}}  href={props.url}>
                        <div className="content">
                            <div className="imgBx">
                                <img style={{ transform: 'scale(1.1)'}} src={props.img} alt={''}/>
                            </div>
                            <div className="contentBx">
                                <h3>{props.name}</h3>
                            </div>
                        </div>
                        </a>
                        <ul className="sci">
                            {
                                frs.map((f) => {
                                    return(
                                        <li><p style={{whiteSpace:'nowrap',fontSize:20,color:'white'}}>{f}</p></li>
                                    );
                                })}

                        </ul>
                    </div>

                </div>
            </section>
        </div>

    );
}