import Button, { type ButtonData } from "./Button";
import type { Locale } from "@/i18n/config";

interface HeroButtonsProps {
  buttons: ButtonData[];
  locale: Locale;
}

export default function HeroButtons({ buttons, locale }: HeroButtonsProps) {
  return (
    <div className="flex flex-col gap-2 mt-8">
      <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2">
        {buttons.map((button, index) => (
          <Button key={index} button={button} locale={locale} />
        ))}
      </div>
    </div>
  );
}
