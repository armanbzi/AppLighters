import Layout from "../src/components/Layout";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import MobileDev from "../src/components/MobileDev";
import WebDev from "../src/components/WebDev";
import DesktopDev from "../src/components/DesktopDev";
import Blockchain from "../src/components/Blockchain";
import ClCards from '../src/components/ClCards';
import FireRing from '../src/components/FireRing'
import NextLink from "next/link";


export default function Home() {
    const overline = {
        color: '#B24FE0',
        fontWeight: 700,
        letterSpacing: '.24em',
        fontSize: {xs:12, lg:13},
        mb: 1.5,
    };
    const sectionTitle = {
        color: '#fff',
        fontWeight: 800,
        fontSize: {xs:34, sm:44, lg:54},
        lineHeight: 1.1,
    };

    return (
        <Layout>
        <Box sx={{position: 'relative', backgroundColor:'#291D30', minHeight:'calc(100vh - 100px)', overflow:'hidden'}}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop:-7,
            }}>
            <FireRing/>
            </Box>
            <Box sx={{position:'absolute',top:'50%',left:0,right:0,transform:'translateY(-50%)',alignItems:'center',justifyContent:'center'}}>
                <Typography sx={{
                    fontSize: {xs:38,sm:42,lg:52},
                    lineHeight: 1.19,
                    color: '#fff',
                    textAlign: 'center',
                }}>We Light Up <br/> Your App</Typography>
            <Box sx={{justifyContent:'center',alignItems:'center'
                ,display:'flex'
                ,marginTop:{xs:3,sm:2,lg:0}}}>
                <NextLink href='/Portfolio' passHref>
                <Button variant="contained" size="large"
                        sx={{width:{xs:180,sm:205,lg:250}, height:{xs:37,sm:42,lg:48} ,
                            fontSize: {xs:12,sm:15,lg:17}, fontWeight: 'bold', mt: {sm: 3, md: 10}}}>
                    View Our Projects
                </Button>
                </NextLink>
            </Box>
            </Box>
        </Box>

        {/* Our Services */}
        <Box sx={{
            background: 'linear-gradient(180deg, #241f2e 0%, #1b1722 100%)',
            color: 'white',
            py: {xs:8, lg:13},
            px: {xs:2, sm:4},
        }}>
            <Box sx={{textAlign:'center', maxWidth:820, mx:'auto', mb:{xs:6, lg:9}}}>
                <Typography sx={overline}>WHAT WE DO</Typography>
                <Typography sx={{...sectionTitle, mb:2.5}}>Our Services</Typography>
                <Typography sx={{color:'rgba(255,255,255,.65)', fontSize:{xs:15, sm:17, lg:18}, lineHeight:1.75}}>
                    We strive to deliver the best version of the application you wish
                    to create or upgrade, enhancing your business workflow to the level you desire.
                    Our team provides skilled developers capable of accelerating your development
                    process and expanding your technical capabilities.
                </Typography>
            </Box>
            <Box sx={{
                display:'flex',
                flexWrap:'wrap',
                justifyContent:'center',
                alignItems:'center',
                gap:{xs:4, sm:5, lg:7},
                maxWidth:1200,
                mx:'auto',
            }}>
                <MobileDev/>
                <WebDev/>
                <DesktopDev/>
                <Blockchain/>
            </Box>
        </Box>

        {/* Our Clients */}
        <Box sx={{
            background: 'linear-gradient(180deg, #191521 0%, #0f0d14 100%)',
            color: 'white',
            py: {xs:8, lg:13},
            px: {xs:2, sm:4},
        }}>
            <Box sx={{textAlign:'center', mb:{xs:7, lg:10}}}>
                <Typography sx={overline}>TRUSTED BY</Typography>
                <Typography sx={sectionTitle}>Our Clients</Typography>
            </Box>
            <Box sx={{
                display:'flex',
                flexWrap:'wrap',
                justifyContent:'center',
                alignItems:'center',
                gap:{xs:4, sm:5, lg:8},
                maxWidth:1100,
                mx:'auto',
            }}>
                <ClCards title={'RHP LTD'} img={"/images/rhpltd.jpg"}
                url={"https://www.rhpltd.net/"}/>
                <ClCards title={'Novartis'} img={"/images/Norvatis.png"}
                url={"https://www.novartis.com/"}/>
                <ClCards title={'Daiichi Sankyo'} img={"/images/Daiichi.png"}
                url={"https://www.daiichisankyo.com/"}/>
                <ClCards title={'Icheers'} img={"/images/iCheers.jpg"}
                url={"http://icheersinfo.com/en/index.html"}/>
            </Box>
        </Box>

    </Layout>);
}
