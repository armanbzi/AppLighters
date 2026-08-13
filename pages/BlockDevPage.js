import Layout from "../src/components/Layout";
import {
    Box,
    Typography,
} from "@mui/material";
import BlockDevPageAnim from '../src/components/BlcokDevPageAnim';




export default function BlockDevPage() {
    return (
        <Layout>
            <Box sx={{height:'calc(100vh - 100px)'}}>
                <BlockDevPageAnim/>
            </Box>

            <Box sx={{
                background: 'linear-gradient(180deg, #3a3446 0%, #262130 100%)',
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
                        Our Blockchain apps are not ready YET...
                    </Typography>
                    <Typography sx={{
                        color:'rgba(255,255,255,.7)',
                        fontSize:{xs:15, sm:17, lg:19},
                        lineHeight:1.75,
                    }}>
                        Our highly skilled team is currently engaged in the development of our first Blockchain apps
                        which will be added to our portfolio as soon as they are ready.
                    </Typography>
                </Box>
            </Box>
        </Layout>
    );
}
