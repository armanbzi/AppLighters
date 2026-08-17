import Layout from "../src/components/Layout";
import ProjectCard from "../src/components/ProjectCard";
import {
    Box,
    Typography,
} from "@mui/material";
import AiDevPageAnim from '../src/components/AiDevPageAnim.js';
import aiApps from "../src/data/aiApps";




export default function AiDevPage() {

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
        position: 'relative',
        zIndex: 2,
    };

    return (
        <Layout>
            <Box sx={{height:'100vh', marginTop:'-100px', position:'relative',
                background:'radial-gradient(ellipse at bottom, #460A58 0%, #090a0f 100%)'}}>
                <AiDevPageAnim/>
            </Box>

            <Box id="ai-apps" sx={{
                background: 'linear-gradient(180deg, #3a3446 0%, #262130 100%)',
                pt: {xs:7, lg:11},
                pb: {xs:8, lg:14},
                px: {xs:2, sm:4},
                position: 'relative',
                zIndex: 2,
            }}>

                {/* Intro */}
                <Box sx={{textAlign:'center', maxWidth:840, mx:'auto', mb:{xs:7, lg:10}, position:'relative', zIndex:2}}>
                    <Typography sx={{
                        color:'#C98BFF',
                        fontWeight:800,
                        fontSize:{xs:28, sm:36, lg:44},
                        lineHeight:1.14,
                        mb:2.5,
                    }}>
                        AI Built In, Not Bolted On
                    </Typography>
                    <Typography sx={{
                        color:'rgba(255,255,255,.7)',
                        fontSize:{xs:15, sm:17, lg:18},
                        lineHeight:1.75,
                    }}>
                        Our team builds AI directly into the products people use every day &mdash; Gemini and
                        Vertex AI for reasoning and personalization, ElevenLabs for natural voice, Firebase for
                        realtime data. Every app below is live in production on both iOS and Android, with the
                        intelligence built into the core rather than bolted on afterwards.
                    </Typography>
                </Box>

                {/* Our AI Integrated Apps */}
                <Typography sx={{
                    color:'#fff',
                    fontWeight:700,
                    fontSize:{xs:24, sm:28, lg:32},
                    textAlign:'center',
                    letterSpacing:'.02em',
                    mb:{xs:3.5, lg:5},
                    position:'relative',
                    zIndex:2,
                }}>
                    Our AI Integrated Apps
                </Typography>

                <Box sx={grid}>
                    {aiApps.map((app) => (
                        <ProjectCard key={app.name} {...app}/>
                    ))}
                </Box>

            </Box>
        </Layout>
    );
}
