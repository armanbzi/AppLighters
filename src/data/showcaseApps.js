// The chain of apps that scrolls under the hero. Starts with the flagship
// products (single-sourced from aiApps so a change there lands here too), then
// the wider catalogue. Every entry needs a logo in public/images.
import aiApps from "./aiApps";

const more = [
    { name: "ONCO365", img: "/images/ONCO365.png", url: "https://onco365.app/" },
    { name: "HEMATO365", img: "/images/HEMATO365.png", url: "https://hemato365.app/" },
    { name: "CARDIO365", img: "/images/CARDIO365.png", url: "https://cardio365.app/" },
    { name: "PNEUMO365", img: "/images/pneumo365.png", url: "https://www.pneumo365.app/" },
    { name: "ALERGO365", img: "/images/ALERGO365.png", url: "https://www.alergo365.app/" },
    { name: "BeActive", img: "/images/BeActive.png", url: "https://apps.apple.com/us/app/beactive/id1540248728" },
    { name: "iCheers", img: "/images/iCheers.jpg", url: "http://icheersinfo.com/en/index.html" },
];

const showcaseApps = [...aiApps.map(({ name, img, url }) => ({ name, img, url })), ...more];

export default showcaseApps;
