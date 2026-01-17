import Button, { type ButtonData } from "./Button";

interface HeroButtonsProps {
  buttons: ButtonData[];
}

export default function HeroButtons({ buttons }: HeroButtonsProps) {
  return (
    <div className="flex flex-col gap-2 mt-8">
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
        {buttons.map((button, index) => (
          <Button key={index} button={button} />
        ))}
      </div>
    </div>
  );
}
