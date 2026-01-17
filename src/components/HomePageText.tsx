import { t, tHeroPortableText } from "@/lib/types";
import type { FrontpageQueryResult } from "@/lib/types";
import type { Locale } from "@/i18n/config";
import HeroPortableTextRenderer from "./HeroPortableTextRenderer";

type Frontpage = NonNullable<FrontpageQueryResult>;

interface HeroProps {
  frontpage: Frontpage;
  locale: Locale;
  birthDate?: string | null;
  variant?: "hero";
}

interface PortfolioTitleProps {
  frontpage: Frontpage;
  locale: Locale;
  variant: "portfolioTitle";
}

type HomePageTextProps = HeroProps | PortfolioTitleProps;

export default function HomePageText(props: HomePageTextProps) {
  const { frontpage, locale } = props;

  if (props.variant === "portfolioTitle") {
    return (
      <div className="px-2">
        <h2 className="font-bold font-[Mogi] text-markus-red text-3xl mb-2">
          {t(frontpage, "portfolioTitle", locale)}
        </h2>
      </div>
    );
  }

  // Default: hero variant
  return (
    <>
      <h1 className="mt-4 mb-1 transition-all text-markus-red text-4xl font-[Mogi]">
        {t(frontpage, "heroTitle", locale)}
      </h1>

      <p className="text-center max-w-[350px]">
        <HeroPortableTextRenderer
          value={tHeroPortableText(frontpage, "heroDescription", locale)}
          birthDate={props.birthDate}
        />
      </p>
    </>
  );
}
