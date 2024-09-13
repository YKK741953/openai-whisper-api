import MainPage from '../components/mainPage'

export const metadata = {
    title: 'Whisper API App',
    description: 'A sample webapp for transcribing speech using OpenAI Speech to Text API based on Whisper',
    icons: {
        icon: '/logo192.png',
        shortcut: '/logo192.png',
        apple: '/logo192.png',
        other: {
            rel: 'apple-touch-icon-precomposed',
            url: '/logo192.png',
        }
    }
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
}

export default function Page() {
    return <MainPage />;
}
