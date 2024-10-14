import { Link } from "react-router-dom";



export default function ExternalLinkButton(props: { className?: string, openInExternalBrowser?: boolean, to: string, type?: "default" | "primary", children?: React.ReactNode }) {
    return (
        <Link

        className={`${props.className} 
        h-12 md:h-8 cursor-pointer outline hover:scale-105 px-4 py-1 rounded-md 
        flex justify-center items-center gap-1 hover:shadow-lg
        focus:scale-105 focus:bg-markusRedSecondary
        active:scale-100 transition-all ${props.type == "primary" ? "bg-markusRed text-white border-none outline-none hover:bg-markusRedSecondary" : "hover:bg-markusRedSecondary hover:text-white focus:text-white hover:outline-none active:bg-markusRedSecondary"}
        `}
            to={props.to}


        >
            {props.children}
        </Link>
    )


}