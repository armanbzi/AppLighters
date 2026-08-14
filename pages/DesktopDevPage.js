import Layout from "../src/components/Layout";
import {
    Box,
    Typography,
} from "@mui/material";
import DesktopDevPageAnim from '../src/components/DesktopDevPageAnim.js';




export default function DesktopDevPage() {
    return (
        <Layout>
            <Box sx={{height:'100vh', marginTop:'-100px', position:'relative'}}>
                <DesktopDevPageAnim/>
            </Box>

            <Box sx={{
                background: 'transparent',
                px: {xs:2, sm:4},
                py: {xs:9, lg:13},
                display: 'flex',
                justifyContent: 'center',
            }}>
                <Box sx={{textAlign:'center', maxWidth:760}}>
                    <Typography sx={{
                        color:'#C98BFF',
                        fontWeight:800,
                        fontSize:{xs:26, sm:34, lg:42},
                        lineHeight:1.16,
                        mb:2.5,
                    }}>
                        Our Desktop apps are not ready YET...
                    </Typography>
                    <Typography sx={{
                        color:'rgba(255,255,255,.7)',
                        fontSize:{xs:15, sm:17, lg:19},
                        lineHeight:1.75,
                    }}>
                        Our highly skilled team is currently engaged in the development of our first Desktop apps
                        which will be added to our portfolio as soon as they are ready.
                    </Typography>
                </Box>
            </Box>
        </Layout>
    );
}
