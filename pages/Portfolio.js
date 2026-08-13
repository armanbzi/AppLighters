import Layout from "../src/components/Layout";
import PrCards from '/src/components/PrCards';
import {
    Box, Typography
} from "@mui/material";
import { useUserAgent } from 'next-useragent'




export default function Portfolio() {
    let ua ='iOS';
    if (typeof window !== 'undefined') {
         ua = useUserAgent(window.navigator.userAgent).os;
    }

    const sectionHeading = {
        textAlign: 'center',
        color: '#fff',
        fontSize: {xs:30,sm:38,lg:46},
        fontWeight: 'bold',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
    };

    const grid = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: {xs:2, sm:3, lg:5},
        maxWidth: 1200,
        mx: 'auto',
    };

    return (
        <Layout>
            <Box sx={{
                minHeight: 'calc(100vh - 100px)',
                backgroundColor: '#3f3648',
                pt: {xs:4, lg:6},
                pb: {xs:6, lg:10},
                px: {xs:2, sm:3},
            }}>

                <Typography sx={{...sectionHeading, mb:{xs:1, lg:2}}}>
                    Web Apps
                </Typography>

                <Box sx={grid}>
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
                </Box>

                <Typography sx={{...sectionHeading, mt:{xs:6, lg:10}, mb:{xs:1, lg:2}}}>
                    Mobile Apps
                </Typography>

                <Box sx={grid}>
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
                </Box>

            </Box>
        </Layout>
    );}
