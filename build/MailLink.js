import React, {Component} from 'react';
import {
    Link
}
from "@mui/material";


const mailStyle={
    color: 'White',
textDecoration:'none',

}

const mailHover={
    color: '#B33BFF',
    textDecoration:'none',

}
class MailLink extends Component {
    constructor(props) {
        super(props);
        this.state = {mailStyle: 'normal'};
    }

    render() {
        return (

            <Link href={"mailto:applighters@gmail.com"} style={this.state.mailStyle ==='normal'?mailStyle:mailHover}
               onMouseEnter={()=>{this.setState({mailStyle :'hover'})}}
               onMouseLeave={()=>{this.setState({mailStyle :'normal'})}}
            sx={{fontSize:{xs:12,sm:16,lg:18}}}>

                applighters@gmail.com

            </Link>
        )}};

export default MailLink;
