import { ArrowRight } from "lucide-react";
import ExternalLinkButton from "./Button";



export default function ProjectItemSmall(props: {title:string, desc:string, link:string}) {

    return (
        <div className="flex justify-between border-b-2  p-2">
            <h3 className="font-bold">{props.title}</h3>
            <p className="">{props.desc}</p>
            <ExternalLinkButton to={props.link}><ArrowRight></ArrowRight></ExternalLinkButton>
        </div>
    )
}