import MainPage from '../components/mainPage'

export const metadata = {
    title: 'Whisper API Sample App',
    description: 'A sample webapp for transcribing speech using OpenAI Speech to Text API based on Whisper',
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