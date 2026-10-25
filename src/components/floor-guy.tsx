import character from '@/data/character.json'
import FigureLoop from '@/components/figure-loop'

// Full-body figure sitting on the floor, idling on a long loop baked from video
// (public/anim/floor.json: 89 s of sitting, shifting, looking around).
export default function FloorGuy({ size, className }: { size: number; className?: string }) {
  return <FigureLoop clip="/anim/floor.json" character={character} size={size} ground className={className} />
}
