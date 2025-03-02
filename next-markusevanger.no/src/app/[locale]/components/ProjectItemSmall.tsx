import { ArrowRight } from "lucide-react";
import Link from "next/link";


export default function ProjectItemSmall(props: { title: string, desc: string, link: string }) {

    return <Link href={props.link} target="_blank" className="grid grid-cols-[1fr_1fr_auto] border-b-2 mb-2  hover:border-b-markusRed transition-all  p-2">
        <h3 className="font-bold">{props.title}</h3>
        <p className="text-sm text pr-2">{props.desc}</p>
        <ArrowRight></ArrowRight>
    </Link>
}