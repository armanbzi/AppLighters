import Layout from "../src/components/Layout";
import {
    Box,
    Stack,
    Typography,
} from "@mui/material";
import DesktopDevPageAnim from '../src/components/DesktopDevPageAnim.js';
import PrCards from "../src/components/PrCards";




export default function DesktopDevPage() {
    return (
        <Layout>
            <Box sx={{height: 610}}>
                <DesktopDevPageAnim/>
            </Box>
            <Box sx={{position:'relative',
                height: {xs:650,sm:1830,lg:580},
                backgroundColor: 'hsla(210,4%,90%,.4)',
            }}>
                <Box sx={{
                    position:'absolute',
                    left:{xs:30,sm:70,lg:180},
                    top:'120px',
                }}>



                    <Typography sx={{color:'#983cea',
                        fontSize: {xs:30,sm:40,lg:50},
                        lineHeight: 1.12,
                        fontWeight: 'bold',
                        maxWidth:{xs:350,sm:500,lg:800}
                    }}>
                        Our Desktop apps are not ready YET...
                    </Typography><br/><br/><br/>
                    <Typography sx={{
                        marginTop:{xs:-4,sm:0,lg:0},
                        fontSize: {xs:16,sm:18,lg:20},
                        lineHeight: 1.8,
                        color: 'rgba(29,31,38,.75)',
                        fontFamily: 'Roboto,Arial,Helvetica,sans-serif',
                        width:{xs:390,sm:590,lg:950},
                    }}>
                        Our highly skilled team is currently engaged in the development of our first Desktop apps which will be added to our portfolio as soon as they are ready.
                    </Typography>
                </Box>
            </Box>


        </Layout>);
}
