import Layout from "../src/components/Layout";
import {
    Box,
    Stack,
    Typography,
} from "@mui/material";
import MobileDevPageAnim from '../src/components/mobileDevPageAnim.js';
import PrCards from "../src/components/PrCards";
import { useUserAgent } from 'next-useragent'




export default function MobileDevPage() {
    let ua ='iOS';
    if (typeof window !== 'undefined') {
        ua = useUserAgent(window.navigator.userAgent).os;
    }
    return (
        <Layout>
        <Box sx={{height:602}}>
            <MobileDevPageAnim/>
        </Box>
        <Box sx={{position:'relative',
            height:{xs:2750,sm:2800,lg:1280},
            backgroundColor: 'hsla(210,4%,90%,.4)',
        }}>
            <Box sx={{
                position:'absolute',
                left:{xs:30,sm:70,lg:180},
                top:'120px',
            }}>
            <Typography sx={{color:'#983cea',
                fontSize:{xs:30,sm:40,lg:50} ,
                lineHeight: 1.12,
                fontWeight: 'bold',}}>
                Creating Apps Since 1999
            </Typography><br/><br/><br/>
            <Typography sx={{
                marginTop:{xs:-4,sm:0,lg:0},
                fontSize: {xs:16,sm:18,lg:20},
                lineHeight: 1.8,
                color: 'rgba(29,31,38,.75)',
                fontFamily: 'Roboto,Arial,Helvetica,sans-serif',
                width:{xs:390,sm:590,lg:950},
            }}>
                Our highly skilled team has successfully developed numerous exceptional iOS and Android mobile apps and services, catering to a user base exceeding 10,000. We continuously strive to deliver the finest mobile app solutions for our clients, significantly enhancing their business operations.
            </Typography><br/><br/><br/><br/>

                <Typography sx={{
                    color:'#983cea',
                    fontSize: {xs:30,sm:40,lg:50},
                    lineHeight: 1.12,
                    fontWeight: 'bold',
                }}>
                    Our Mobile Apps
                </Typography><br/><br/><br/><br/>
                <Stack direction={{xs:"column",sm:"column",lg:"row"}} spacing={0} sx={{marginTop:{xs:-20,sm:-19,lg:-17},marginLeft:{xs:0,sm:12,lg:-7}}}>
                    <Box sx={{width:220,height:300}}>
                        <PrCards frameWorks={['React Native','Python','Django']} name={"ALERGO365"} img={"/images/ALERGO365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=app.alergo365&hl=en&gl=US'
                                     :'https://apps.apple.com/ph/app/alergo365/id1530910440'}/>
                    </Box>
                    <Box sx={{width:220,height:300}}>
                        <PrCards frameWorks={['Ionic','','PHP']} name={"iCheers"} img={"/images/iCheers.jpg"}
                                 url={ua==='android'?'https://baixarapk.gratis/en/app/1244283176/icheers-aplicaci%C3%B3n-de-citas'
                                     :'https://apps.apple.com/us/app/icheers-dating-app/id1244283176'}/>
                    </Box>
                    <Box sx={{width:220,height:300}}>
                        <PrCards frameWorks={['React Native','Python','Django']} name={"PNEUMO365"} img={"/images/pneumo365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=app.pneumo365&hl=en&gl=US'
                                     :'https://apps.apple.com/nz/app/pneumo365/id1468647598'}/>
                    </Box>
                    <Box sx={{width:220,height:300}}>
                        <PrCards frameWorks={['React Native','Python','Django']} name={"CARDIO365"} img={"/images/CARDIO365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=hr.apps.n206949985&hl=en&gl=US'
                                     :'https://apps.apple.com/gb/app/cardio365/id1008779129'}/>
                    </Box>

                </Stack>



                <Stack direction={{xs:"column",sm:"column",lg:"row"}} spacing={0} sx={{marginLeft:{xs:0,sm:12,lg:-7}}}>
                    <Box sx={{width:220,height:300}}>
                        <PrCards frameWorks={['React Native','Python','Django']} name={"ONCO365"} img={"/images/ONCO365.png"}
                        url={ua==='android'?'https://play.google.com/store/apps/details?id=hr.apps.n206999954&hl=en&gl=US'
                            :'https://apps.apple.com/us/app/onco365/id1094718689'}/>
                    </Box>
                    <Box sx={{width:220,height:300}}>
                        <PrCards frameWorks={['React Native','Python','Django']} name={"HEMATO365"} img={"/images/HEMATO365.png"}
                        url={ua==='android'?'https://play.google.com/store/apps/details?id=hr.apps.n207027939&hl=en&gl=US'
                            :'https://apps.apple.com/uy/app/hemato365/id1094674654'}/>
                    </Box>
                    <Box sx={{width:220,height:300}}>
                        <PrCards frameWorks={['','React Native','']} name={"BeActive"} img={'/images/BeActive.png'}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=com.beactivedpoc&hl=en&gl=US'
                                     :'https://apps.apple.com/us/app/beactive/id1540248728'}/>
                    </Box>
                </Stack>

            </Box>
        </Box>


    </Layout>);
}
