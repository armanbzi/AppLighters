// The flagship apps we've worked on. Single source of truth — rendered as the
// "Apps we've lit up" proof strip on every service page and in Portfolio, so a
// change here lands everywhere at once.
// Logo files live in public/images/ and are lowercase on purpose: the build
// host is case-sensitive even though macOS is not.
// img: null falls back to the initials tile in ProjectCard.

const aiApps = [
    {
        name: 'Beboos',
        url: 'https://beboos.app/en',
        img: '/images/beboos.png',
        frameWorks: ['React Native', 'Firestore', 'Firebase'],
    },
    {
        name: 'GiftPlanner',
        url: 'https://giftplanner.app/#',
        img: '/images/giftplanner.png',
        frameWorks: ['React Native', 'Firebase', 'Gemini'],
    },
    {
        name: 'MatchPlanner',
        url: 'https://matchplanner.se',
        img: '/images/matchplanner.png',
        frameWorks: ['React Native', 'Firebase', 'TypeScript'],
    },
    {
        name: 'ToastAi',
        url: 'https://toastai.app',
        img: '/images/toastai.png',
        frameWorks: ['React Native', 'Gemini', 'ElevenLabs'],
    },
    {
        name: 'FamTale',
        url: 'https://famtale.app',
        img: '/images/famtale.png',
        frameWorks: ['React Native', 'Firebase', 'Vertex AI'],
    },
];

export default aiApps;
