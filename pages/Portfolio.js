import Layout from "../src/components/Layout";
import ProjectCard from "../src/components/ProjectCard";
import {
    Box, Typography
} from "@mui/material";
import aiApps from "../src/data/aiApps";
import { useUserAgent } from 'next-useragent'




export default function Portfolio() {
    let ua ='iOS';
    if (typeof window !== 'undefined') {
         ua = useUserAgent(window.navigator.userAgent).os;
    }

    const sectionHeading = {
        color: '#fff',
        fontWeight: 700,
        fontSize: {xs:24, sm:28, lg:32},
        textAlign: 'center',
        letterSpacing: '.02em',
    };

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
            <Box sx={{
                minHeight: 'calc(100vh - 100px)',
                background: 'linear-gradient(180deg, #3a3446 0%, #262130 100%)',
                pt: {xs:6, lg:9},
                pb: {xs:8, lg:14},
                px: {xs:2, sm:4},
            }}>

                {/* Page header */}
                <Box sx={{textAlign:'center', mb:{xs:6, lg:9}}}>
                    <Typography sx={{
                        color:'#B24FE0',
                        fontWeight:700,
                        letterSpacing:'.24em',
                        fontSize:{xs:12, lg:13},
                        mb:1.5,
                    }}>
                        PORTFOLIO
                    </Typography>
                    <Typography sx={{
                        color:'#fff',
                        fontWeight:800,
                        fontSize:{xs:36, sm:46, lg:56},
                        lineHeight:1.08,
                        letterSpacing:'-0.02em',
                        background: 'linear-gradient(118deg, #ffffff 0%, #f1e4ff 45%, #C98BFF 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb:2,
                    }}>
                        Our Work
                    </Typography>
                    <Typography sx={{
                        color:'rgba(255,255,255,.6)',
                        fontSize:{xs:15, lg:18},
                        lineHeight:1.6,
                        maxWidth:620,
                        mx:'auto',
                    }}>
                        A selection of the web and mobile products we&apos;ve designed, built, and shipped.
                    </Typography>
                </Box>

                {/* Web Apps */}
                <Typography sx={{...sectionHeading, mb:{xs:3.5, lg:5}}}>
                    Web Apps
                </Typography>

                <Box sx={grid}>
                    <ProjectCard frameWorks={['NextJs','MUI','React']} name={"AppLighters"} img={'/images/applighters-app.png'}
                                 url={'/'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"ONCO365"} img={"/images/ONCO365.png"}
                                 url={'https://onco365.app/'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"HEMATO365"} img={"/images/HEMATO365.png"}
                                 url={'https://hemato365.app/'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"CARDIO365"} img={"/images/CARDIO365.png"}
                                 url={'https://cardio365.app/'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"PNEUMO365"} url={"https://www.pneumo365.app/"} img={'/images/pneumo365.png'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"ALERGO365"} img={"/images/ALERGO365.png"}
                                 url={'https://www.alergo365.app/'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"RHP Content Viewer"} img={"/images/RHPLogo.jpeg"}
                                 url={'https://rhpcontentviewer.com/'}/>
                    <ProjectCard frameWorks={['WordPress','CSS','MySQL']} name={"Oliynyk Fit"} img={"/images/Oliynyk_logoo.png"}
                                 url={'https://oliynyk.fit/'}/>
                </Box>

                {/* Mobile Apps */}
                <Typography sx={{...sectionHeading, mt:{xs:8, lg:12}, mb:{xs:3.5, lg:5}}}>
                    Mobile Apps
                </Typography>

                <Box sx={grid}>
                    {aiApps.map((app) => (
                        <ProjectCard key={app.name} {...app} ai/>
                    ))}
                    <ProjectCard frameWorks={['React Native','Python','Django']} name={"ALERGO365"} img={"/images/ALERGO365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=app.alergo365&hl=en&gl=US'
                                     :'https://apps.apple.com/ph/app/alergo365/id1530910440'}/>
                    <ProjectCard frameWorks={['Ionic','','PHP']} name={"iCheers"} img={"/images/iCheers.jpg"}
                                 url={ua==='android'?'https://baixarapk.gratis/en/app/1244283176/icheers-aplicaci%C3%B3n-de-citas'
                                     :'https://apps.apple.com/us/app/icheers-dating-app/id1244283176'}/>
                    <ProjectCard frameWorks={['React Native','Python','Django']} name={"CARDIO365"} img={"/images/CARDIO365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=hr.apps.n206949985&hl=en&gl=US'
                                     :'https://apps.apple.com/gb/app/cardio365/id1008779129'}/>
                    <ProjectCard frameWorks={['React Native','Python','Django']} name={"PNEUMO365"} img={"/images/pneumo365.png"}
                                 url={ua==='android'?'https://play.google.com/store/apps/details?id=app.pneumo365&hl=en&gl=US'
                                     :'https://apps.apple.com/nz/app/pneumo365/id1468647598'}/>
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
    );}
