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
        <Box sx={{position: 'relative', backgroundColor:'#291D30',height:{xs:565,sm:565,lg:525}}}>
            <Box sx={{position:'absolute',marginLeft:{xs:-14,sm:8,lg:36},marginTop:-7}}>
            <FireRing/>
            </Box>
            <Box sx={{position:'absolute',top:{xs:166,sm:150,lg:140},left:0,right:0,bottom:0,alignItems:'center',justifyContent:'center'}}>
                <Typography sx={{
                    fontSize: {xs:38,sm:42,lg:52},
                    lineHeight: 1.19,
                    color: '#fff',
                    textAlign: 'center',
                }}>We Light Up <br/> Your App</Typography>
            <Box sx={{marginLeft:{xs:15,sm:35,lg:61},marginTop:{xs:3,sm:2,lg:0}}}>
                <NextLink href='/Portfolio' passHref>
                <Button variant="contained" size="large"
                        sx={{width:{xs:180,sm:205,lg:250}, height:{xs:37,sm:42,lg:48} , fontSize: {xs:12,sm:15,lg:17}, fontWeight: 'bold', mt: {sm: 3, md: 10}}}>
                    View Our Projects
                </Button>   
                </NextLink>
            </Box>
            </Box>
        </Box>
        <Box sx={{backgroundColor:'#262728',color:'White',height:{xs:700,sm:800,lg:900}, position:'absolute',width:{xs:414,sm:768,lg:1263}}}>
            <br/><br/><br/>
            <Typography sx={{fontSize:{xs:48,sm:58,lg:68} ,
                lineHeight: 1.06,
                color: '#fff',
                textAlign: 'center',}}>
                OUR SERVICES
            </Typography>
<br/><br/>
            <Typography sx={{
                fontSize:{xs:16,sm:18,lg:24} ,
                lineHeight: 1.67,
                color: '#fff',
                maxWidth:{xs:450,sm:550,lg:850},
                textAlign: 'center',
                marginLeft:{xs:1,sm:14,lg:27}

            }}>
                We strive to deliver the best version of the application you wish
                to create or upgrade, enhancing your business workflow to the level you desire.
                Our team provides skilled developers capable of accelerating your development
                process and expanding your technical capabilities.
            </Typography>


        <Stack direction="row" spacing={{xs:2.5,sm:2,lg:5}} sx={{marginLeft:{xs:-7,sm:-3,lg:10},mt: {sm: 4, md: 6}, position: 'relative'}}>
            <Box sx={{width:{xs:27.3 + '%',sm:27.5 + '%',lg:20 + '%'} }}>
                <MobileDev/>
            </Box>
            <Box sx={{width: {xs:18 + '%',sm:18 + '%',lg:20 + '%'}}}>
                <WebDev/>
            </Box>
            <Box sx={{width: {xs:18 + '%',sm:22 + '%',lg:20 + '%'}}}>
                <DesktopDev/>
            </Box>
            <Box sx={{width: {xs:18 + '%',sm:20 + '%',lg:20 + '%'}}}>
                <Blockchain/>
            </Box>

        </Stack>
        </Box>

        <Box sx={{backgroundColor: 'black',
            marginTop:{xs:87,sm:100,lg:112},
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
            <Stack direction={{xs:"column",sm:"column",lg:"row"}} spacing={9} sx={{marginTop:{xs:10,sm:8,lg:17},marginLeft:{xs:0,sm:0,lg:10}}}>
            <ClCards title={'RHP LTD'} img={"https://media-exp1.licdn.com/dms/image/C560BAQFH6Z-IxUqG-A/company-logo_200_200/0/1530627794675?e=2147483647&v=beta&t=F4fcd6Q-Fdp8achQD1QVMxy61xQPSfiz35B3nQ7F5lQ"}
            url={"https://www.rhpltd.net/"}/>
                <ClCards title={'Novartis'} img={"/images/Norvatis.png"}
                url={"https://www.novartis.com/"}/>
                <ClCards title={'Daiichi Sankyo'} img={"https://companiesmarketcap.com/img/company-logos/512/DSKYF.png"}
                url={"https://www.daiichisankyo.com/"}/>
                <ClCards title={'Icheers'} img={"https://scontent-muc2-1.xx.fbcdn.net/v/t39.30808-6/299827652_151132384227279_3320037228030704352_n.png?_nc_cat=107&ccb=1-7&_nc_sid=5f2048&_nc_ohc=2ttZACu3pYkAX8saWiS&_nc_ht=scontent-muc2-1.xx&oh=00_AfC2LwBSQpvyMJk0gcQWSCpz5ICeAi30J_6up3f0pSJTFg&oe=6541D77E"}
                url={"http://icheersinfo.com/en/index.html"}/>
            </Stack>
        </Box>








    </Layout>);
}
