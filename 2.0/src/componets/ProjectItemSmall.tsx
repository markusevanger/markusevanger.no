import { ArrowRight } from "lucide-react";
import ExternalLinkButton from "./Button";



export default function ProjectItemSmall(props: { title: string, desc: string, link: string }) {

    return (
        <li className="grid grid-cols-3 justify-between border-b-2  p-2">
            <h3 className="font-bold">{props.title}</h3>
            <p className="text-sm">{props.desc}</p>
            <div className="pl-36">
                <ExternalLinkButton to={props.link}><ArrowRight></ArrowRight></ExternalLinkButton>
            </div>
        </li>
    )
}