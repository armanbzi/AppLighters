import Layout from "../src/components/Layout";
import ProjectCard from "../src/components/ProjectCard";
import {
    Box,
    Typography,
} from "@mui/material";
import WebDevPageAnim from '../src/components/WebDevPageAnim.js';




export default function WebDevPage() {

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
            <Box sx={{minHeight:'calc(100vh - 100px)'}}>
                <WebDevPageAnim/>
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
                        We Create Amazing Web Apps
                    </Typography>
                    <Typography sx={{
                        color:'rgba(255,255,255,.7)',
                        fontSize:{xs:15, sm:17, lg:18},
                        lineHeight:1.75,
                    }}>
                        Our proficient team has a remarkable track record of creating exceptional web apps that
                        have garnered widespread recognition. With a diverse portfolio of successful projects, our
                        web apps have consistently delivered outstanding results.
                    </Typography>
                </Box>

                {/* Our Web Apps */}
                <Typography sx={{
                    color:'#fff',
                    fontWeight:700,
                    fontSize:{xs:24, sm:28, lg:32},
                    textAlign:'center',
                    letterSpacing:'.02em',
                    mb:{xs:3.5, lg:5},
                }}>
                    Our Web Apps
                </Typography>

                <Box sx={grid}>
                    <ProjectCard frameWorks={['NextJs','MUI','React']} name={"AppLighters"} img={'/images/APP_Lighters.png'}
                                 url={'/'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"ONCO365"} img={"/images/ONCO365.png"}
                                 url={'https://onco365.app/'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"HEMATO365"} img={"/images/HEMATO365.png"}
                                 url={'https://hemato365.app/'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"CARDIO365"} img={"/images/CARDIO365.png"}
                                 url={'https://cardio365.app/'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"PNEUMO365"} url={"https://www.pneumo365.app/"} img={'/images/PNEUMO365.png'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"ALERGO365"} img={"/images/ALERGO365.png"}
                                 url={'https://www.alergo365.app/'}/>
                    <ProjectCard frameWorks={['ReactJs','Python','Django']} name={"RHP Content Viewer"} img={"/images/RHPLogo.jpeg"}
                                 url={'https://rhpcontentviewer.com/'}/>
                    <ProjectCard frameWorks={['WordPress','CSS','MySQL']} name={"Oliynyk Fit"} img={"/images/Oliynyk_logoo.png"}
                                 url={'https://oliynyk.fit/'}/>
                </Box>

            </Box>
        </Layout>
    );
}
