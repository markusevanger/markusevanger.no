

export default function ProjectItem(props: { index: number, snapPointIndexes: Set<number>, title: string, subtitle: string, body: string, imageUrl: string, children?: React.ReactNode }) {
    return (
        <li

            className="w-full flex-shrink-0 snap-center p-1"
            style={{
                scrollSnapAlign: props.snapPointIndexes.has(props.index) ? "start" : ""
            }}>
            <div className=" aspect-video rounded-2xl outline shadow-md hover:shadow-xl transition-all overflow-hidden">
                <img className=" object-fill w-full h-full" src={props.imageUrl}></img>
            </div>

            <div className="flex flex-col">
                <div>
                    <h2 className="font-bold mt-2 text-lg" >{props.title}</h2>
                    <p className="italic text-sm"   >{props.subtitle}</p>
                    <p className="break-words">{props.body}</p>
                </div>
                
                <div className="w-full flex flex-col md:flex-row justify-end gap-2 mt-4">
                    {props.children}
                </div>
            </div>

        </li>
    )
}