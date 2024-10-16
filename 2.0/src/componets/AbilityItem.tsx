import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";



export default function ProjectItemSmall(props: { title: string, link: string }) {


    return props.link == "" ? <div className="grid grid-cols-[1fr_auto] border-b-2 mb-2 p-2">
        <h3 className="">{props.title}</h3>

    </div> :
        <Link to={props.link} target="_blank" className="grid grid-cols-[1fr_auto] border-b-2 mb-2  hover:border-b-markusRed transition-all  p-2">
            <h3 className="">{props.title}</h3>
            <ArrowRight></ArrowRight>
        </Link>
}