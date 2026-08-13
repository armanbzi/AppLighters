import Layout from "../src/components/Layout";
import {
    Box,
    Stack,
    Typography,
} from "@mui/material";
import BlockDevPageAnim from '../src/components/BlcokDevPageAnim';




export default function BlockDevPage() {
    return (
        <Layout>
            <Box sx={{height:602}}>
                <BlockDevPageAnim/>
            </Box>
            <Box sx={{position:'relative',
                height: {xs:600,sm:650,lg:700},
                backgroundColor: 'hsla(210,4%,90%,.4)',
            }}>
                <Box sx={{
                    position:'absolute',
                    left:{xs:50,sm:70,lg:180},
                    top:'120px',
                }}>

                    <Typography sx={{color:'#983cea',
                        fontSize: {xs:30,sm:40,lg:50},
                        lineHeight: 1.12,
                        fontWeight: 'bold',
                        maxWidth:{xs:350,sm:500,lg:800}
                    }}>
                        Our Blockchain apps are not ready YET...
                    </Typography><br/><br/><br/>
                    <Typography sx={{
                        marginTop:{xs:-4,sm:0,lg:0},
                        fontSize: {xs:16,sm:18,lg:20},
                        lineHeight: 1.8,
                        color: 'rgba(29,31,38,.75)',
                        fontFamily: 'Roboto,Arial,Helvetica,sans-serif',
                        width:{xs:340,sm:590,lg:950},
                    }}>
                        Our highly skilled team is currently engaged in the development of our first Blockchain apps which will be added to our portfolio as soon as they are ready.
                    </Typography>
                </Box>
            </Box>


        </Layout>);
}
