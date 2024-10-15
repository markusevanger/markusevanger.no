import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";



export default function ProjectItemSmall(props: { title: string, desc: string, link: string }) {

    return (
        <Link to={props.link} className="flex justify-between border-b-2 hover:border-b-markusRed transition-all  p-2">
            <h3 className="font-bold">{props.title}</h3>
            <p className="">{props.desc}</p>
            <ArrowRight></ArrowRight>
        </Link>
    )
}