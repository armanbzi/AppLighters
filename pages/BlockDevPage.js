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
            <Box sx={{height:'calc(100vh - 100px)'}}>
                <BlockDevPageAnim/>
            </Box>
            <Box sx={{position:'relative',
                height: {xs:600,sm:650,lg:700},
                backgroundColor: '#3f3648',
            }}>
                <Box sx={{
                    position:'absolute',
                    left:{xs:50,sm:70,lg:180},
                    top:'120px',
                }}>

                    <Typography sx={{color:'#983cea',
                        fontSize: {xs:24,sm:40,lg:50},
                        lineHeight: 1.12,
                        fontWeight: 'bold',
                        maxWidth:{xs:380,sm:800,lg:900}
                    }}>
                        Our Blockchain apps are not ready YET...
                    </Typography><br/><br/><br/>
                    <Typography sx={{
                        marginTop:{xs:-4,sm:0,lg:0},
                        fontSize: {xs:16,sm:18,lg:20},
                        lineHeight: 1.8,
                        color: 'rgba(255,255,255,.75)',
                        fontFamily: 'Roboto,Arial,Helvetica,sans-serif',
                        width:{xs:380,sm:800,lg:950},
                    }}>
                        Our highly skilled team is currently engaged in the development of our first Blockchain apps which will be added to our portfolio as soon as they are ready.
                    </Typography>
                </Box>
            </Box>


        </Layout>);
}
