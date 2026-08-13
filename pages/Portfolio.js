import Layout from "../src/components/Layout";
import PrCards from '/src/components/PrCards';
import {
    Box,
    Stack, Typography
} from "@mui/material";
import { useUserAgent } from 'next-useragent'




export default function Portfolio() {
    let ua ='iOS';
    if (typeof window !== 'undefined') {
         ua = useUserAgent(window.navigator.userAgent).os;
    }


    return (
        <Layout>
            <Box sx={{height:{xs:5000,sm:5000,lg:1722},backgroundColor:'#3f3648'}}>

<br/><br/><br/>
            <Typography sx={{
                textAlign:'center',
                color:'#AEBDBE',
                fontSize: {xs:30,sm:35,lg:40},
                lineHeight: 1.12,
                fontWeight: 'bold',
            }}>
                Web Apps
            </Typography>
            <Stack direction={{xs:"column",sm:"column",lg:"row"}} spacing={{xs:0, sm:0, lg:9}} sx={{marginLeft:{xs:1,sm:45,lg:0}}}>
                <Box sx={{width:220,height:300}}>
                    <PrCards frameWorks={['NextJs','MUI','React']} name={"AppLighters"} img={'/images/APP_Lighters.png'}
                             url={'/'}/>
                </Box>
                <Box sx={{width:220,height:300}}>
                    <PrCards frameWorks={['ReactJs','Python','Django']} name={"ONCO365"} img={"/images/ONCO365.png"}
                             url={'https://onco365.app/'}/>
                </Box>

                <Box sx={{width:220,height:300}}>
                    <PrCards frameWorks={['ReactJs','Python','Django']} name={"HEMATO365"} img={"/images/HEMATO365.png"}
                             url={'https://hemato365.app/'}/>
                </Box>
                <Box sx={{width:220,height:300}}>
                    <PrCards frameWorks={['ReactJs','Python','Django']} name={"CARDIO365"} img={"/images/CARDIO365.png"}
                             url={'https://cardio365.app/'}/>
                </Box>
            </Stack>


            <Stack direction={{xs:"column",sm:"column",lg:"row"}} spacing={{xs:0, sm:0, lg:9}} sx={{marginLeft:{xs:1,sm:45,lg:0}}}>
                <Box sx={{width:220,height:300}}>
                    <PrCards frameWorks={['ReactJs','Python','Django']} name={"PNEUMO365"} url={"https://www.pneumo365.app/"} img={'/images/pneumo365.png'}/>
                </Box>
                <Box sx={{width:220,height:300}}>
                    <PrCards frameWorks={['ReactJs','Python','Django']} name={"ALERGO365"} img={"/images/ALERGO365.png"}
                             url={'https://www.alergo365.app/'}/>
                </Box>
                <Box sx={{width:220,height:300}}>
                    <PrCards frameWorks={['ReactJs','Python','Django']} name={"RHP Content Viewer"} img={"/images/RHPLogo.jpeg"}
                             url={'https://rhpcontentviewer.com/'}/>
                </Box>
                <Box sx={{width:220,height:300}}>
                    <PrCards frameWorks={['WordPress','CSS','MySQL']} name={"Oliynyk Fit"} img={"/images/Oliynyk_logoo.png"}
                             url={'https://oliynyk.fit/'}/>
                </Box>

            </Stack><br/><br/><br/><br/>

            <Typography sx={{
                marginTop:10,
                textAlign:'center',
                color:'#AEBDBE',
                fontSize: {xs:30,sm:35,lg:40},
                lineHeight: 1.12,
                fontWeight: 'bold',
            }}>
                Mobile Apps
            </Typography>


            <Stack direction={{xs:"column",sm:"column",lg:"row"}} spacing={{xs:0,sm:0,lg:9}} sx={{marginLeft:{xs:1,sm:45,lg:0}}}>
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
                    <PrCards frameWorks={['React Native','Python','Django']} name={"CARDIO365"} img={"/images/CARDIO365.png"}
                             url={ua==='android'?'https://play.google.com/store/apps/details?id=hr.apps.n206949985&hl=en&gl=US'
                                 :'https://apps.apple.com/gb/app/cardio365/id1008779129'}/>
                </Box>
                <Box sx={{width:220,height:300}}>
                    <PrCards frameWorks={['React Native','Python','Django']} name={"PNEUMO365"} img={"/images/pneumo365.png"}
                             url={ua==='android'?'https://play.google.com/store/apps/details?id=app.pneumo365&hl=en&gl=US'
                                 :'https://apps.apple.com/nz/app/pneumo365/id1468647598'}/>
                </Box>
            </Stack>



            <Stack direction={{xs:"column",sm:"column",lg:"row"}} spacing={{xs:0,sm:0,lg:9}} sx={{marginLeft:{xs:1,sm:45,lg:0}}}>
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
        </Layout>
    );}
