import Layout from "../src/components/Layout";
import {
    Box,
    Button,
    Stack,
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
        <Box sx={{backgroundColor:'#262728',color:'White',height:{xs:700,sm:800,lg:900},
            position:'relative',
        }}>
            <br/><br/><br/>
            <Typography sx={{fontSize:{xs:48,sm:58,lg:68} ,
                lineHeight: 1.06,
                color: '#fff',
                textAlign: 'center',

            }}>
                OUR SERVICES
            </Typography>
<br/><br/><br/>
            <Box sx={{
                display:'flex',
                justifyContent:'center',
                alignItems:'center'
            }}>
            <Typography sx={{
                fontSize:{xs:16,sm:18,lg:24} ,
                lineHeight: 1.67,
                color: '#fff',
                textAlign: 'center',
                position:'relative',
               maxWidth:{xs:400,sm:800,lg:800}

            }}>
                We strive to deliver the best version of the application you wish
                to create or upgrade, enhancing your business workflow to the level you desire.
                Our team provides skilled developers capable of accelerating your development
                process and expanding your technical capabilities.
            </Typography>
            </Box>
        <Stack direction="row" spacing={{xs:-2,sm:2,lg:6}} sx={{justifyContent:'center',marginLeft:-6,
            alignItems:'center',
            mt: {sm: 4, md: 6}}}>
                <MobileDev/>
                <WebDev/>
                <DesktopDev/>
                <Blockchain/>

        </Stack>
        </Box>
        <Box sx={{backgroundColor: 'black',
            color: 'White',
            height: {xs:1600,sm:1600,lg:800},
            alignItems:'center'}}>
            <br/><br/><br/>
        <Typography sx={{
            textAlign:'center',
            fontSize:{xs:48 ,sm:58 ,lg:68},
            lineHeight: 1.06,}}>
            OUR CLIENTS

        </Typography>
            <Stack direction={{xs:"column",sm:"column",lg:"row"}} spacing={9} sx={{marginTop:{xs:10,sm:8,lg:17},
            justifyContent:'center',
                alignItems:'center',
                display:'flex'
            }}>
            <ClCards title={'RHP LTD'} img={"/images/rhpltd.jpg"}
            url={"https://www.rhpltd.net/"}/>
                <ClCards title={'Novartis'} img={"/images/Norvatis.png"}
                url={"https://www.novartis.com/"}/>
                <ClCards title={'Daiichi Sankyo'} img={"/images/Daiichi.png"}
                url={"https://www.daiichisankyo.com/"}/>
                <ClCards title={'Icheers'} img={"/images/iCheers.jpg"}
                url={"http://icheersinfo.com/en/index.html"}/>
            </Stack>
        </Box>








    </Layout>);
}
