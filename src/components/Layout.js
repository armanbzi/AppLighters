import Navigation from "./Navigation";
import {
    Box, Button,
    FormControl,
    Input,
    InputLabel,
    Link,
    Stack,
    Typography
} from "@mui/material";
import Facebook from "../../public/icons/socials/facebook.svg"
import Instagram from "../../public/icons/socials/instagram.svg"
import Linkedin from "../../public/icons/socials/linkedin.svg"
import { TextareaAutosize } from '@mui/material';
import MailLink from "./MailLink";
import { useForm } from 'react-hook-form';
import { init, sendForm } from 'emailjs-com';
import {width} from "@mui/system";

init('1ihU6hWB-uNhXs5cS');

export default function Layout({children, menu}) {

    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = data => {
        console.log(data);
        sendForm('service_cmwxcj9', 'template_mxlgvo5', '#contact-form')
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                alert('Thanks, we will response shortly :)');
                // Refresh the page
                location.reload();
            }, function(error) {
                console.log('FAILED...', error);
                alert('Please try again!');
                // Refresh the page
                location.reload();
            });

    }

    return (<Box sx={{position: 'relative'}}>
        <Navigation menu={menu}/>
        {children}
        <Box sx={{
            backgroundColor: "#1F1F1F",
            minHeight:"300px",
            justifyContent:'center',
            alignItems:'center',
            display:'flex'
        }}>
            <Stack direction="row" spacing={1} sx={{
                color: 'White',
                height: {xs: 900, sm: 900, lg: 1000},
                alignItems:'center'}}>

                <Box className={'Estimate'} sx={{
                    height: 700,
                    backgroundColor: '#262728',
                    width:{xs:200,sm:620,lg:750},}}>

                        <Box sx={{marginLeft: {xs:1,sm:6,lg:6},marginRight: {xs:1,sm:6,lg:6}}}>
                    <Typography sx={{fontSize:{xs:18,sm:28,lg:38} ,
                        lineHeight: 1.11,
                        color: '#cc7dff',
                         marginTop: 10,}}>Request Estimate</Typography><br/>


                        <form id='contact-form' onSubmit={handleSubmit(onSubmit)}
                            method="post">
                        <br/>
                        <Stack direction="row" spacing={{xs:10,sm:14,lg:25}} >
                            <InputLabel htmlFor="user_name" sx={{color:'white',fontSize:{xs:12,sm:14,lg:16}}}>Name</InputLabel>
                            <InputLabel htmlFor="user_email" sx={{color:'white',marginTop:5,fontSize:{xs:12,sm:14,lg:16}}}>Email</InputLabel>
                            <br/>
                        </Stack>
                        <Stack direction="row" spacing={{xs:3,sm:4,lg:4}} sx={{marginLeft:{xs:-0.5,sm:1.5,lg:1.5},marginTop:{xs:0,sm:0,lg:2}}}>
                            <FormControl>
                            <Input type={'text'}
                                   sx={{
                                       width:{xs:85,sm:120,lg:170},
                                       fontSize:{xs:10,sm:12,lg:15},
                                       color:'#cc7dff',
                                       lineHeight: 1.33,
                                       height:{xs:25,sm:30,lg:35} ,
                                       backgroundColor: '#444',
                                       borderRadius: 2,
                                       border: '1px solid hsla(0,0%,100%,.16)',
                                   }}
                                   name='user_name'
                                   id="user_name"
                                   required
                            />
                            </FormControl>
                            <FormControl>
                            <Input type={'text'} id="user_email" name={"user_email"} required
                                   sx={{
                                       width:{xs:85,sm:120,lg:170},
                                       color:'#cc7dff',
                                       fontSize: {xs:10,sm:12,lg:15},
                                       lineHeight: 1.33,
                                       height: {xs:25,sm:30,lg:35},
                                       backgroundColor: '#444',
                                       borderRadius: 2,
                                       border: '1px solid hsla(0,0%,100%,.16)',
                                   }}/>
                            </FormControl>
                        </Stack>
                            <FormControl>
                        <InputLabel htmlFor="message" sx={{color:'white',marginLeft:{xs:-1.3,sm:-1.3,lg:0}, marginTop:5,fontSize:{xs:12,sm:14,lg:16}}}>Project Detail</InputLabel><br/><br/><br/><br/>
                        <TextareaAutosize id="message" name={"message"} maxRows={100} required style={{
                            marginLeft:13,
                            width: {xs:140,sm:320,lg:420},
                            height: 200,
                            color:'#cc7dff',
                            marginTop:{xs:2,sm:3,lg:5},
                            fontSize: 15,
                            lineHeight: 1.33,
                            backgroundColor: '#444',
                            borderRadius: 10,
                            border: '1px solid #cc7dff',


                        }}/></FormControl><br/><br/><br/>
                        <Button id="subtimate" variant="contained" size="large" type="submit"
                                sx={{width:{lg:200,sm:200,xs:170} , height: 44, fontSize: 14, fontWeight: 'bold', marginLeft:{xs:1,sm:1,lg:50}}}>
                            Send Request
                        </Button>
                        </form>
                    </Box>
                </Box>
                <Box sx={{
                    marginTop: 50,
                    marginLeft:1,
                    marginRight:1,
                    height: 700,
                    backgroundColor: '#262728',
                    width:{xs:180,sm:300,lg:350}
                }}>

                    <Stack direction="column" spacing={7} sx={{marginTop: 10,marginLeft:{xs:3,sm:8,lg:8}}}>

                        <Typography sx={{fontSize:{xs:18,sm:28,lg:38},
                            lineHeight: 1.11,
                            color: '#cc7dff',}}>
                            Contact Info
                        </Typography>
                        <Typography sx={{maxWidth:{xs:150,sm:170,lg:220},
                            fontSize: {xs:10,sm:12,lg:14},
                            lineHeight: 1.57,}}>
                            Need help? Feel free to contact us and we'll respond as soon as possible.
                        </Typography>
                        <MailLink/>
                        <Typography sx={{fontSize:{xs:18,sm:28,lg:38},
                            lineHeight: 1.11,
                            color:"#cc7dff",
                            textAlign:'center',
                            width:{xs:135,sm:150,lg:200}}}>
                            Follow us
                        </Typography>

                        <Stack direction="row" spacing={{xs:2,sm:4.5,lg:4.5}}
                        sx={{width:{xs:180,sm:180,lg:220}}}>
                            <Link href="https://de.linkedin.com/in/arman-bazarchi-4395631a0" sx={{
                                marginLeft:{xs:-1.5,sm:-2.5,lg:0},
                                borderRadius: '50%',
                                border: '2px solid hsla(0,0%,100%,.75)',
                                boxSizing: 'border-box',
                                opacity: .6,
                                width:{xs:35,sm:40,lg:45},
                                height: {xs:35,sm:40,lg:45},
                                alignItems:'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection:'row',}}>

                                <Box sx={{width: 25, height:25,}}>
                                    <Linkedin/>
                                </Box>
                            </Link>
                            <Link sx={{
                                borderRadius: '50%',
                                border: '2px solid hsla(0,0%,100%,.75)',
                                boxSizing: 'border-box',
                                opacity: .6,
                                width:{xs:35,sm:40,lg:45},
                                height: {xs:35,sm:40,lg:45},
                                alignItems:'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection:'row',
                                }}>
                                <Box sx={{
                                    width: 25,
                                    height:25,
                                }}
                                >
                                   <Instagram/>
                                </Box>
                            </Link>
                            <Link sx={{borderRadius: '50%',
                                border: '2px solid hsla(0,0%,100%,.75)',
                                boxSizing: 'border-box',
                                opacity: .6,
                                width:{xs:35,sm:40,lg:45},
                                height: {xs:35,sm:40,lg:45},
                                alignItems:'center',
                                justifyContent: 'center',
                                display: 'flex',
                                flexDirection:'row',
                                }}>
                                <Box sx={{
                                    width: 24,
                                    height:24,
                                }}>
                                    <Facebook/>
                                </Box>

                            </Link>
                        </Stack>
                    </Stack>

                </Box>
            </Stack>

        </Box>
    </Box>);
}