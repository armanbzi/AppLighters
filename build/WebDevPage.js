import Layout from "../src/components/Layout";
import {
    Box,
    Stack,
    Typography,
} from "@mui/material";
import WebDevPageAnim from '../src/components/WebDevPageAnim.js';
import PrCards from '/src/components/PrCards';




export default function WebDevPage() {
    return (
        <Layout>
        <Box sx={{height:602}}>
            <WebDevPageAnim/>
        </Box>
        <Box sx={{position:'relative',
            height: {xs:3050,sm:3100,lg:1280},
            backgroundColor: 'hsla(210,4%,90%,.4)',
        }}>
            <Box sx={{
                position:'absolute',
                left:{xs:30,sm:70,lg:180},
                top:'120px',
            }}>



                <Typography sx={{color:'#983cea',
                    fontSize: {xs:30,sm:40,lg:50},
                    lineHeight: 1.12,
                    fontWeight: 'bold',
                    maxWidth:{xs:350,sm:500,lg:800}
                }}>
                    We Create Amazing Web Apps
                </Typography><br/><br/><br/>
                <Typography sx={{
                    marginTop:{xs:-4,sm:0,lg:0},
                    fontSize: {xs:16,sm:18,lg:20},
                    lineHeight: 1.8,
                    color: 'rgba(29,31,38,.75)',
                    fontFamily: 'Roboto,Arial,Helvetica,sans-serif',
                    width:{xs:390,sm:590,lg:950},
                }}>
                    Our proficient team has a remarkable track record of creating exceptional web apps that have garnered widespread recognition. With a diverse portfolio of successful projects, our web apps have consistently delivered outstanding results.
                </Typography><br/><br/><br/><br/>

                <Typography sx={{
                    color:'#983cea',
                    fontSize: {xs:30,sm:40,lg:50},
                    lineHeight: 1.12,
                    fontWeight: 'bold',
                }}>
                    Our Web Apps
                </Typography><br/><br/><br/><br/>

                <Stack direction={{xs:"column",sm:"column",lg:"row"}} spacing={0} sx={{marginTop:{xs:-20,sm:-19,lg:-17},marginLeft:{xs:0,sm:12,lg:-7}}}>
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


                <Stack direction={{xs:"column",sm:"column",lg:"row"}} spacing={0} sx={{marginLeft:{xs:0,sm:12,lg:-7}}}>
                    <Box sx={{width:220,height:300}}>
                        <PrCards frameWorks={['ReactJs','Python','Django']} name={"PNEUMO365"} url={"https://www.pneumo365.app/"} img={'/images/PNEUMO365.png'}/>
                    </Box>
                    <Box sx={{width:220,height:300}}>
                        <PrCards frameWorks={['ReactJs','Python','Django']} name={"ALERGO365"} img={"/images/ALERGO365.png"}
                                 url={'https://www.alergo365.app/'}/>
                    </Box>
                    <Box sx={{width:220,height:300}}>
                        <PrCards frameWorks={['ReactJs','Python','Django']} name={"RHP Content Viewer"} img={"/images/RHPLogo.jpeg"}
                                 url={'https://rhpcontentviewer.com/'}/>
                    </Box>

                </Stack>

            </Box>
        </Box>


    </Layout>);
}
