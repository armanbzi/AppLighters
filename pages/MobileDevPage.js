import Layout from "../src/components/Layout";
import ProjectCard from "../src/components/ProjectCard";
import {
    Box,
    Typography,
} from "@mui/material";
import MobileDevPageAnim from '../src/components/mobileDevPageAnim.js';
import { useUserAgent } from 'next-useragent'




export default function MobileDevPage() {
    let ua ='iOS';
    if (typeof window !== 'undefined') {
        ua = useUserAgent(window.navigator.userAgent).os;
    }

    const grid = {
        display: 'grid',
        gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
        },
        gap: {xs:2.5, lg:3.5},
        maxWidth: 1180,
        mx: 'auto',
    };

    return (
        <Layout>
            <Box sx={{minHeight:'100vh', marginTop:'-100px'}}>
                <MobileDevPageAnim/>
            </Box>

            <Box sx={{
                background: 'linear-gradient(180deg, #3a3446 0%, #262130 100%)',
                pt: {xs:7, lg:11},
                pb: {xs:8, lg:14},
                px: {xs:2, sm:4},
            }}>

                {/* Intro */}
                <Box sx={{textAlign:'center', maxWidth:840, mx:'auto', mb:{xs:7, lg:10}}}>
                    <Typography sx={{
                        color:'#C98BFF',
                        fontWeight:800,
                        fontSize:{xs:28, sm:36, lg:44},
                        lineHeight:1.14,
                        mb:2.5,
                    }}>
                        Creating Apps Since 1999
                    </Typography>
                    <Typography sx={{
                        color:'rgba(255,255,255,.7)',
                        fontSize:{xs:15, sm:17, lg:18},
                        lineHeight:1.75,
                    }}>
                        Our highly skilled team has successfully developed numerous exceptional iOS and Android
                        mobile apps and services, catering to a user base exceeding 10,000. We continuously strive
                        to deliver the finest mobile app solutions for our clients, significantly enhancing their
                        business operations.
                    </Typography>
                </Box>

                {/* Our Mobile Apps */}
                <Typography sx={{
                    color:'#fff',
                    fontWeight:700,
                    fontSize:{xs:24, sm:28, lg:32},
                    textAlign:'center',
                    letterSpacing:'.02em',
                    mb:{xs:3.5, lg:5},
                }}>
                    Our Mobile Apps
                </Typography>

                <Box sx={grid}>
                    <ProjectCard frameWorks={['React Native','Python','Django']} name={"ALERGO365"} img={"/images/ALERGO365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=app.alergo365&hl=en&gl=US'
                                     :'https://apps.apple.com/ph/app/alergo365/id1530910440'}/>
                    <ProjectCard frameWorks={['Ionic','','PHP']} name={"iCheers"} img={"/images/iCheers.jpg"}
                                 url={ua==='android'?'https://baixarapk.gratis/en/app/1244283176/icheers-aplicaci%C3%B3n-de-citas'
                                     :'https://apps.apple.com/us/app/icheers-dating-app/id1244283176'}/>
                    <ProjectCard frameWorks={['React Native','Python','Django']} name={"PNEUMO365"} img={"/images/pneumo365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=app.pneumo365&hl=en&gl=US'
                                     :'https://apps.apple.com/nz/app/pneumo365/id1468647598'}/>
                    <ProjectCard frameWorks={['React Native','Python','Django']} name={"CARDIO365"} img={"/images/CARDIO365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=hr.apps.n206949985&hl=en&gl=US'
                                     :'https://apps.apple.com/gb/app/cardio365/id1008779129'}/>
                    <ProjectCard frameWorks={['React Native','Python','Django']} name={"ONCO365"} img={"/images/ONCO365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=hr.apps.n206999954&hl=en&gl=US'
                                     :'https://apps.apple.com/us/app/onco365/id1094718689'}/>
                    <ProjectCard frameWorks={['React Native','Python','Django']} name={"HEMATO365"} img={"/images/HEMATO365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=hr.apps.n207027939&hl=en&gl=US'
                                     :'https://apps.apple.com/uy/app/hemato365/id1094674654'}/>
                    <ProjectCard frameWorks={['','React Native','']} name={"BeActive"} img={'/images/BeActive.png'}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=com.beactivedpoc&hl=en&gl=US'
                                     :'https://apps.apple.com/us/app/beactive/id1540248728'}/>
                </Box>

            </Box>
        </Layout>
    );
}
