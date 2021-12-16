import Helmet from 'react-helmet'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { KARELIA } from '../utils/css'

const StreamrPlug = styled.span`
    background-color: white;
    border-radius: 50px;
    bottom: 20px;
    font-size: 12px;
    left: 20px;
    padding: 10px 20px;
    position: absolute;

    a {
        color: #ff5924 !important;
    }
`

const CreateLink = styled(Link)`
    align-items: center;
    background: #ff5924;
    border: none;
    border-radius: 100px;
    box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.1);
    color: white;
    display: inline-flex;
    font-family: ${KARELIA};
    font-size: 22px;
    padding: 20px 50px 25px;
    transition: all 0.4s ease-in-out;

    :hover,
    :focus {
        background-color: #de4716;
        transform: translateY(10px);
    }

    span {
        margin-right: 10px;
    }

    svg {
        display: block;
    }
`

type Props = {
    className?: string
}

const UnstyledHome = ({ className }: Props) => {
    return (
        <>
            <Helmet title="Streamr Chat dApp" />
            <main className={className}>
                <Navbar />
                <h1>Hello world.</h1>
                <CreateLink to="/chat">
                    <span>Create new room</span>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 20C9.741 20 9.49261 19.8971 9.30947 19.714C9.12632 19.5308 9.02344 19.2824 9.02344 19.0234V0.976562C9.02344 0.717562 9.12632 0.46917 9.30947 0.286029C9.49261 0.102888 9.741 0 10 0C10.259 0 10.5074 0.102888 10.6905 0.286029C10.8737 0.46917 10.9766 0.717562 10.9766 0.976562V19.0234C10.9766 19.2824 10.8737 19.5308 10.6905 19.714C10.5074 19.8971 10.259 20 10 20Z"
                            fill="white"
                        />
                        <path
                            d="M19.0234 10.9766H0.976562C0.717562 10.9766 0.46917 10.8737 0.286029 10.6905C0.102888 10.5074 0 10.259 0 10C0 9.741 0.102888 9.49261 0.286029 9.30947C0.46917 9.12632 0.717562 9.02344 0.976562 9.02344H19.0234C19.2824 9.02344 19.5308 9.12632 19.714 9.30947C19.8971 9.49261 20 9.741 20 10C20 10.259 19.8971 10.5074 19.714 10.6905C19.5308 10.8737 19.2824 10.9766 19.0234 10.9766Z"
                            fill="white"
                        />
                    </svg>
                </CreateLink>
                <StreamrPlug>
                    Decentralised, encrypted chat powered by{' '}
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://streamr.network"
                    >
                        Streamr
                    </a>
                </StreamrPlug>
            </main>
        </>
    )
}

const Home = styled(UnstyledHome)`
    h1 {
        animation: float 3s ease-in-out infinite;
        font-size: 80px;
        margin-bottom: 100px;
        margin-top: -100px;
    }

`

export default Home
