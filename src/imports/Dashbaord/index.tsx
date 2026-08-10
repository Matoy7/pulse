import { createContext, useContext, useEffect, useRef, useState } from "react";
import svgPaths from "./svg-j8ue68fght";
import imgImageAnthony from "./e80369b0bde9bc36bf18f9bf130673329ab18cff.png";
import { KpiCard } from "@/components/ui/KpiCard";

// ---------------------------------------------------------------------------
// Dashboard data model: realistic mock data per date-range selection.
// Selecting a range in the header dropdown updates every KPI, the funnel,
// and the revenue breakdown chart via DashboardDataContext below.
// ---------------------------------------------------------------------------

type RangeKey = "24h" | "7d" | "30d" | "90d" | "year" | "custom";

interface RangeOption {
  key: RangeKey;
  label: string;
}

const RANGE_OPTIONS: RangeOption[] = [
  { key: "24h", label: "Last 24 Hours" },
  { key: "7d", label: "Last 7 Days" },
  { key: "30d", label: "Last 30 Days" },
  { key: "90d", label: "Last 90 Days" },
  { key: "year", label: "This Year" },
  { key: "custom", label: "Custom Range" },
];

interface FunnelStage {
  pct: number;
}

interface RevenueBar {
  value: string;
  height: number; // px, drives the bar's rendered height
}

interface RangeData {
  retention: string;
  retentionBadge: string;
  revenue: string;
  revenueGrowth: string;
  dau: string;
  dauGrowth: string;
  avgSession: string;
  dropOff: string;
  funnel: [FunnelStage, FunnelStage, FunnelStage, FunnelStage, FunnelStage];
  revenueBars: [RevenueBar, RevenueBar, RevenueBar, RevenueBar, RevenueBar];
}

const DATA_BY_RANGE: Record<RangeKey, RangeData> = {
  "24h": {
    retention: "45.2%",
    retentionBadge: "+3.4% This 24h",
    revenue: "$84,200",
    revenueGrowth: "12%",
    dau: "430",
    dauGrowth: "12%",
    avgSession: "13m 42s",
    dropOff: "14.6%",
    funnel: [{ pct: 100 }, { pct: 78 }, { pct: 62 }, { pct: 45 }, { pct: 38 }],
    revenueBars: [
      { value: "24.6K", height: 168 },
      { value: "21.7K", height: 147.84 },
      { value: "18.2K", height: 124.32 },
      { value: "14.6K", height: 99.12 },
      { value: "10.3K", height: 70.56 },
    ],
  },
  "7d": {
    retention: "48.7%",
    retentionBadge: "+2.1% This week",
    revenue: "$126,800",
    revenueGrowth: "18%",
    dau: "1,240",
    dauGrowth: "9%",
    avgSession: "14m 05s",
    dropOff: "13.1%",
    funnel: [{ pct: 100 }, { pct: 81 }, { pct: 65 }, { pct: 49 }, { pct: 41 }],
    revenueBars: [
      { value: "38.9K", height: 168 },
      { value: "33.1K", height: 143 },
      { value: "27.4K", height: 118.5 },
      { value: "21.8K", height: 94.2 },
      { value: "15.2K", height: 65.7 },
    ],
  },
  "30d": {
    retention: "51.3%",
    retentionBadge: "+5.8% This month",
    revenue: "$382,400",
    revenueGrowth: "24%",
    dau: "3,840",
    dauGrowth: "15%",
    avgSession: "15m 18s",
    dropOff: "11.4%",
    funnel: [{ pct: 100 }, { pct: 84 }, { pct: 69 }, { pct: 53 }, { pct: 44 }],
    revenueBars: [
      { value: "142K", height: 168 },
      { value: "118K", height: 139.7 },
      { value: "96.4K", height: 114 },
      { value: "74.1K", height: 87.6 },
      { value: "52.8K", height: 62.4 },
    ],
  },
  "90d": {
    retention: "53.8%",
    retentionBadge: "+8.2% This quarter",
    revenue: "$1.08M",
    revenueGrowth: "31%",
    dau: "5,420",
    dauGrowth: "22%",
    avgSession: "16m 47s",
    dropOff: "10.2%",
    funnel: [{ pct: 100 }, { pct: 87 }, { pct: 73 }, { pct: 58 }, { pct: 49 }],
    revenueBars: [
      { value: "398K", height: 168 },
      { value: "329K", height: 138.9 },
      { value: "271K", height: 114.5 },
      { value: "204K", height: 86.1 },
      { value: "146K", height: 61.6 },
    ],
  },
  year: {
    retention: "56.1%",
    retentionBadge: "+11.6% This year",
    revenue: "$3.94M",
    revenueGrowth: "42%",
    dau: "7,910",
    dauGrowth: "29%",
    avgSession: "17m 32s",
    dropOff: "9.1%",
    funnel: [{ pct: 100 }, { pct: 89 }, { pct: 76 }, { pct: 62 }, { pct: 53 }],
    revenueBars: [
      { value: "1.46M", height: 168 },
      { value: "1.18M", height: 135.7 },
      { value: "962K", height: 110.6 },
      { value: "718K", height: 82.6 },
      { value: "511K", height: 58.8 },
    ],
  },
  custom: {
    retention: "45.2%",
    retentionBadge: "Custom range",
    revenue: "$84,200",
    revenueGrowth: "12%",
    dau: "430",
    dauGrowth: "12%",
    avgSession: "13m 42s",
    dropOff: "14.6%",
    funnel: [{ pct: 100 }, { pct: 78 }, { pct: 62 }, { pct: 45 }, { pct: 38 }],
    revenueBars: [
      { value: "24.6K", height: 168 },
      { value: "21.7K", height: 147.84 },
      { value: "18.2K", height: 124.32 },
      { value: "14.6K", height: 99.12 },
      { value: "10.3K", height: 70.56 },
    ],
  },
};

interface DashboardDataContextValue {
  range: RangeKey;
  setRange: (r: RangeKey) => void;
  data: RangeData;
}

const DashboardDataContext = createContext<DashboardDataContextValue | null>(null);

function useDashboardData(): DashboardDataContextValue {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) {
    throw new Error("useDashboardData must be used within DashboardDataContext.Provider");
  }
  return ctx;
}

function Svg() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[25.285px] top-[calc(50%+0.398px)]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="45.1507" preserveAspectRatio="none" viewBox="0 0 45.1507 45.1507" width="45.1507">
        <g clipPath="url(#clip0_0_86)" id="SVG">
          <path d={svgPaths.p1687f600} fill="#FEFEFE" id="Vector" />
        </g>
        <defs>
          <clipPath id="clip0_0_86">
            <rect fill="white" height="45.1507" width="45.1507" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#623ec4] content-stretch flex items-center justify-center relative rounded-[9.482px] shrink-0 size-[31.605px]" data-name="Background">
      <Svg />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[22.4px] whitespace-nowrap">
        <p className="leading-[24.4px]">Pulse</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">
        <p className="leading-[22px]">Nova Arena</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <Heading />
      <Container2 />
    </div>
  );
}

function Container() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8.371px] items-center p-[22.324px] relative size-full">
          <Background />
          <Container1 />
        </div>
      </div>
    </div>
  );
}

function Svg1() {
  return (
    <div className="relative shrink-0 size-[17.441px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="31.1446" preserveAspectRatio="none" viewBox="0 0 31.1446 31.1446" width="31.1446">
        <g id="SVG">
          <path d={svgPaths.pe0b5800} id="Vector" stroke="#623EC4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.07631" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink() {
  return (
    <button
      type="button"
      className="bg-[#e0d8f3] relative rounded-[10px] shrink-0 w-full cursor-pointer transition-colors duration-150 hover:bg-[#d5c9ef] text-left"
      data-name="Item → Link"
    >
      <div className="flex flex-row items-center gap-[12px] px-[12px] py-[10px] size-full">
        <Svg1 />
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-[#623ec4] text-[16px] whitespace-nowrap">Dashboard</p>
      </div>
    </button>
  );
}

function Image9Vectorized() {
  return (
    <div className="h-[18.988px] relative shrink-0 w-[19.379px]" data-name="image 9 [Vectorized]">
      <svg className="absolute block inset-0 size-full" fill="none" height="33.9067" preserveAspectRatio="none" viewBox="0 0 34.6058 33.9067" width="34.6058">
        <g id="image 9 [Vectorized]">
          <path d={svgPaths.p11293e00} fill="currentColor" id="Vector" />
          <path d={svgPaths.p3452cc00} fill="currentColor" id="Vector_2" />
          <path d={svgPaths.p1d0052a0} fill="currentColor" id="Vector_3" />
          <path d={svgPaths.p3e6c4c80} fill="currentColor" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink1() {
  return (
    <button
      type="button"
      className="relative rounded-[10px] shrink-0 w-full cursor-pointer text-left text-[#1e293b] transition-colors duration-150 hover:bg-[#f4f2fb] hover:text-[#623ec4]"
      data-name="Item → Link"
    >
      <div className="flex flex-row items-center gap-[12px] px-[12px] py-[10px] size-full">
        <Image9Vectorized />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] whitespace-nowrap">Retentions</p>
      </div>
    </button>
  );
}

function Image3Vectorized() {
  return (
    <div className="relative shrink-0 size-[19px]" data-name="image 3 [Vectorized]">
      <svg className="absolute block inset-0 size-full" fill="none" height="27.7187" preserveAspectRatio="none" viewBox="0 0 29.5666 27.7187" width="29.5666">
        <g clipPath="url(#clip0_0_121)" id="image 3 [Vectorized]">
          <path d={svgPaths.p1183f100} fill="currentColor" id="Vector" />
          <path d={svgPaths.p108d7880} fill="currentColor" id="Vector_2" />
          <path d={svgPaths.p3e386e00} fill="currentColor" id="Vector_3" />
          <path d={svgPaths.p2a6a200} fill="currentColor" id="Vector_4" />
        </g>
        <defs>
          <clipPath id="clip0_0_121">
            <rect fill="white" height="27.7187" width="29.5666" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ItemLink2() {
  return (
    <button
      type="button"
      className="relative rounded-[10px] shrink-0 w-full cursor-pointer text-left text-[#1e293b] transition-colors duration-150 hover:bg-[#f4f2fb] hover:text-[#623ec4]"
      data-name="Item → Link"
    >
      <div className="flex flex-row items-center gap-[12px] px-[12px] py-[10px] size-full">
        <Image3Vectorized />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] whitespace-nowrap">Players</p>
      </div>
    </button>
  );
}

function Image4Vectorized() {
  return (
    <div className="h-[19.556px] relative shrink-0 w-[20.208px]" data-name="image 4 [Vectorized]">
      <svg className="absolute block inset-0 size-full" fill="none" height="34.9222" preserveAspectRatio="none" viewBox="0 0 36.0862 34.9222" width="36.0862">
        <g id="image 4 [Vectorized]">
          <path d={svgPaths.p2c147f00} fill="currentColor" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink3() {
  return (
    <button
      type="button"
      className="relative rounded-[10px] shrink-0 w-full cursor-pointer text-left text-[#1e293b] transition-colors duration-150 hover:bg-[#f4f2fb] hover:text-[#623ec4]"
      data-name="Item → Link"
    >
      <div className="flex flex-row items-center gap-[12px] px-[12px] py-[10px] size-full">
        <Image4Vectorized />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] whitespace-nowrap">Features</p>
      </div>
    </button>
  );
}

function Image5Vectorized() {
  return (
    <div className="h-[19.652px] relative shrink-0 w-[20.804px]" data-name="image 5 [Vectorized]">
      <svg className="absolute block inset-0 size-full" fill="none" height="35.0934" preserveAspectRatio="none" viewBox="0 0 37.1497 35.0934" width="37.1497">
        <g id="image 5 [Vectorized]">
          <path d={svgPaths.p373d6700} fill="currentColor" id="Vector" />
          <path d={svgPaths.pd082500} fill="currentColor" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink4() {
  return (
    <button
      type="button"
      className="relative rounded-[10px] shrink-0 w-full cursor-pointer text-left text-[#1e293b] transition-colors duration-150 hover:bg-[#f4f2fb] hover:text-[#623ec4]"
      data-name="Item → Link"
    >
      <div className="flex flex-row items-center gap-[12px] px-[12px] py-[10px] size-full">
        <Image5Vectorized />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] whitespace-nowrap">Revenue</p>
      </div>
    </button>
  );
}

function Image6Vectorized() {
  return (
    <div className="h-[20.39px] relative shrink-0 w-[20.076px]" data-name="image 6 [Vectorized]">
      <svg className="absolute block inset-0 size-full" fill="none" height="36.41" preserveAspectRatio="none" viewBox="0 0 35.8498 36.41" width="35.8498">
        <g id="image 6 [Vectorized]">
          <path d={svgPaths.p3cb6f080} fill="currentColor" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ItemLink5() {
  return (
    <button
      type="button"
      className="relative rounded-[10px] shrink-0 w-full cursor-pointer text-left text-[#1e293b] transition-colors duration-150 hover:bg-[#f4f2fb] hover:text-[#623ec4]"
      data-name="Item → Link"
    >
      <div className="flex flex-row items-center gap-[12px] px-[12px] py-[10px] size-full">
        <Image6Vectorized />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal not-italic text-[16px] whitespace-nowrap">{`Bugs & Issues`}</p>
      </div>
    </button>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="List">
      <ItemLink />
      <ItemLink1 />
      <ItemLink2 />
      <ItemLink3 />
      <ItemLink4 />
      <ItemLink5 />
    </div>
  );
}

function Nav() {
  return (
    <div className="relative shrink-0 w-full" data-name="Nav">
      <div className="content-stretch flex flex-col items-start px-[11.162px] relative size-full">
        <List />
      </div>
    </div>
  );
}

function NavMargin() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Nav:margin">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center pt-[11.162px] relative size-full">
        <Nav />
      </div>
    </div>
  );
}

function Container3() {
  return <div className="bg-[#e5e7eb] h-[26.612px] relative shrink-0 w-[0.95px]" data-name="Container" />;
}

function TopNav() {
  return (
    <div className="bg-white drop-shadow-[0px_1.901px_7.604px_rgba(0,0,0,0.06)] relative rounded-[19.009px] shrink-0 w-full" data-name="TopNav">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start justify-center px-[19.009px] py-[9.504px] relative size-full">
        <Container3 />
      </div>
    </div>
  );
}

function ImageAnthony() {
  return (
    <div className="relative rounded-[19.009px] shrink-0 size-[38.017px]" data-name="Image (Anthony)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[19.009px] size-full" src={imgImageAnthony} />
    </div>
  );
}

function Text() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic relative shrink-0 text-[#111827] text-[16px] whitespace-nowrap">Rob Cohen</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap" dir="auto">
          Senior PM
        </p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[0.95px] items-start relative shrink-0" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[15.207px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="27.155" preserveAspectRatio="none" viewBox="0 0 27.155 27.155" width="27.155">
        <g id="Icon">
          <path d={svgPaths.p7a0aec0} id="Vector" stroke="#9CA3AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.26292" />
        </g>
      </svg>
    </div>
  );
}

function IconMargin() {
  return (
    <div className="content-stretch flex items-start pl-[1.901px] relative shrink-0" data-name="Icon (margin)">
      <Icon />
    </div>
  );
}

function Frame2() {
  return (
    <button type="button" className="relative shrink-0 w-full cursor-pointer text-left transition-colors duration-150 hover:bg-[#f4f2fb] rounded-[10px]">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[13.44px] items-center px-[17.92px] py-[8px] relative size-full">
        <ImageAnthony />
        <Container4 />
        <IconMargin />
      </div>
    </button>
  );
}

function AsideSidebar() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col items-start relative shrink-0 w-[264px] max-w-[264px] h-full overflow-y-auto overflow-x-hidden" data-name="Aside - Sidebar">
      <Container />
      <NavMargin />
      <TopNav />
      <Frame2 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[23.52px] whitespace-nowrap">
        <p className="leading-[25.115px]">Dashboard</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">
        <p className="leading-[16.743px]">{`Overview of your game's performance`}</p>
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="content-stretch flex flex-col gap-[2.79px] items-start relative shrink-0" data-name="Container">
      <Heading1 />
      <Container6 />
    </div>
  );
}

function Image24Vectorized() {
  return (
    <div className="h-[16.073px] relative shrink-0 w-[17.412px]" data-name="image 24 [Vectorized]">
      <svg className="absolute block inset-0 size-full" fill="none" height="28.701" preserveAspectRatio="none" viewBox="0 0 31.0927 28.701" width="31.0927">
        <g id="image 24 [Vectorized]">
          <path d={svgPaths.p3fa02480} fill="#0B1A2F" id="Vector" />
          <path d={svgPaths.p3d729100} fill="#0B1A2F" id="Vector_2" />
          <path d={svgPaths.p27572d00} fill="#0B1A2F" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Svg2() {
  return (
    <div className="relative shrink-0 size-[11.162px]" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="19.9326" preserveAspectRatio="none" viewBox="0 0 19.9326 19.9326" width="19.9326">
        <g id="SVG">
          <path d={svgPaths.p2a90bd40} id="Vector" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66105" />
        </g>
      </svg>
    </div>
  );
}

function DateRangeDropdown() {
  const { range, setRange } = useDashboardData();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activeLabel = RANGE_OPTIONS.find((o) => o.key === range)?.label ?? "Last 24 Hours";

  return (
    <div className="relative shrink-0" ref={rootRef} data-name="Container">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="bg-white content-stretch flex gap-[8.371px] items-center justify-center px-[11.86px] py-[7.674px] relative rounded-[8.371px] shrink-0 cursor-pointer transition-colors duration-150 hover:bg-[#f8f7ff]"
        data-name="Button"
      >
        <div aria-hidden className="absolute border-[#e2e8f0] border-[0.698px] border-solid inset-0 pointer-events-none rounded-[8.371px]" />
        <Image24Vectorized />
        <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[16px] text-center whitespace-nowrap">
          <p className="leading-[16.743px]">{activeLabel}</p>
        </div>
        <div className={`relative shrink-0 size-[11.162px] transition-transform duration-150 ${open ? "rotate-180" : ""}`} data-name="SVG">
          <svg className="absolute block inset-0 size-full" fill="none" height="19.9326" preserveAspectRatio="none" viewBox="0 0 19.9326 19.9326" width="19.9326">
            <g id="SVG">
              <path d={svgPaths.p2a90bd40} id="Vector" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66105" />
            </g>
          </svg>
        </div>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[200px] bg-white rounded-[10px] border border-[#e2e8f0] shadow-[0px_8px_24px_rgba(15,23,42,0.12)] py-[6px] origin-top-right animate-[dropdownOpen_150ms_ease-out]"
        >
          {RANGE_OPTIONS.map((opt) => {
            const selected = opt.key === range;
            return (
              <button
                key={opt.key}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  setRange(opt.key);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-[8px] px-[14px] py-[9px] text-left text-[16px] font-['Inter:Regular',sans-serif] transition-colors duration-150 cursor-pointer ${
                  selected ? "text-[#623ec4] font-medium bg-[#f5f3ff]" : "text-[#1e293b] hover:bg-[#f8fafc]"
                }`}
              >
                <span className="whitespace-nowrap">{opt.label}</span>
                {selected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                    <path d="M2.5 7.2L5.5 10.2L11.5 3.8" stroke="#623ec4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" data-name="Container">
      <DateRangeDropdown />
    </div>
  );
}

function Container7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Container">
      <Container8 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-start justify-end px-[17.92px] relative shrink-0">
      <Container7 />
    </div>
  );
}

function Image7Vectorized() {
  return (
    <button type="button" className="h-[38px] w-[38px] flex items-center justify-center relative shrink-0 rounded-[11.405px] cursor-pointer transition-colors duration-150 hover:bg-[#f1f5f9]" data-name="image 7 [Vectorized]">
      <div className="h-[19.43px] relative shrink-0 w-[20.34px]">
        <svg className="absolute block inset-0 size-full" fill="none" height="34.696" preserveAspectRatio="none" viewBox="0 0 36.3224 34.696" width="36.3224">
          <g id="image 7 [Vectorized]">
            <path d={svgPaths.p35882b80} fill="#293751" id="Vector" />
            <path d={svgPaths.p3dc82180} fill="#293751" id="Vector_2" />
          </g>
        </svg>
      </div>
    </button>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16.157px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="28.8522" preserveAspectRatio="none" viewBox="0 0 28.8522 28.8522" width="28.8522">
        <g id="Icon">
          <path d={svgPaths.p2421cd00} id="Vector" stroke="#374151" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40435" />
          <path d={svgPaths.pc631240} id="Vector_2" stroke="#374151" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40435" />
        </g>
      </svg>
    </div>
  );
}

function IconBox() {
  return (
    <button type="button" className="bg-white content-stretch flex items-center justify-center relative rounded-[11.405px] shrink-0 size-[38.017px] cursor-pointer transition-colors duration-150 hover:bg-[#f1f5f9]" data-name="IconBox">
      <Icon1 />
    </button>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16.157px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="28.8522" preserveAspectRatio="none" viewBox="0 0 28.8522 28.8522" width="28.8522">
        <g id="Icon">
          <path d={svgPaths.p3a221f80} id="Vector" stroke="#374151" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40435" />
          <path d={svgPaths.p5e0ff2} id="Vector_2" stroke="#374151" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.40435" />
        </g>
      </svg>
    </div>
  );
}

function IconBox1() {
  return (
    <button type="button" className="bg-white relative rounded-[11.405px] shrink-0 size-[38.017px] cursor-pointer transition-colors duration-150 hover:bg-[#f1f5f9]" data-name="IconBox">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon2 />
      </div>
    </button>
  );
}

function Container10() {
  return (
    <div className="absolute bg-[#f59e0b] left-[24.573px] rounded-[8.554px] size-[17.107px] top-[-3.898px]" data-name="Container">
      <div aria-hidden className="absolute border-[1.383px] border-solid border-white inset-0 pointer-events-none rounded-[8.554px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center p-[1.383px] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[22px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">3</p>
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Container">
      <IconBox1 />
      <Container10 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <Image7Vectorized />
      <IconBox />
      <Container9 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <Frame1 />
      <Frame3 />
    </div>
  );
}

function HeaderSection() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Header Section">
      <Container5 />
      <Frame4 />
    </div>
  );
}

function Svg3() {
  return (
    <div className="flex-[1_0_0] min-h-px relative w-full" data-name="SVG">
      <svg className="absolute block inset-0 size-full" fill="none" height="281.286" preserveAspectRatio="none" viewBox="0 0 529.085 281.286" width="529.085">
        <g clipPath="url(#clip0_0_46)" id="SVG">
          <path d={svgPaths.p16e53a00} fill="white" id="Vector" />
          <g id="Container" />
        </g>
        <defs>
          <clipPath id="clip0_0_46">
            <rect fill="white" height="281.286" width="529.085" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SparklineVisualizationPlaceholder() {
  return (
    <div className="absolute bottom-[-0.151px] content-stretch flex flex-col h-[157.52px] items-start justify-center left-[-0.353px] opacity-30 right-[-0.118px]" data-name="Sparkline Visualization Placeholder">
      <Svg3 />
    </div>
  );
}

function OverlayOverlayBlur() {
  return (
    <div className="h-[13.046px] relative shrink-0 w-[16.391px]" data-name="Overlay+OverlayBlur">
      <svg className="absolute block inset-0 size-full" fill="none" height="23.2962" preserveAspectRatio="none" viewBox="0 0 29.2696 23.2962" width="29.2696">
        <foreignObject height="37.6323" width="43.6057" x="-7.16806" y="-7.16806">
          <div style={{ backdropFilter: "blur(2.005px)", clipPath: "url(#bgblur_0_0_52_clip_path)", height: "100%", width: "100%" }} {...{ xmlns: "http://www.w3.org/1999/xhtml" }} />
        </foreignObject>
        <g id="Overlay+OverlayBlur" data-figma-bg-blur-radius="7.16806">
          <rect fill="white" fillOpacity="0.2" height="23.2962" rx="9.55741" width="29.2696" />
          <path d={svgPaths.p2ac38960} fill="white" id="Icon" />
        </g>
        <defs>
          <clipPath id="bgblur_0_0_52_clip_path" transform="translate(7.16806 7.16806)">
            <rect height="23.2962" rx="9.55741" width="29.2696" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[6.563px] items-start min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[6.094px]" data-name="Icon">
        <svg className="absolute block inset-0 size-full" fill="none" height="10.8831" preserveAspectRatio="none" viewBox="0 0 10.8831 10.8831" width="10.8831">
          <path d={svgPaths.p145f6700} fill="#2D2100" id="Icon" />
        </svg>
      </div>
    </div>
  );
}

function Background1() {
  const { data } = useDashboardData();
  return (
    <div className="bg-[#fae07a] content-stretch flex gap-[6px] items-center px-[10px] py-[4px] relative rounded-[8px] shrink-0" data-name="Background">
      <Container12 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium not-italic relative shrink-0 text-[#2d2100] text-[16px] tracking-[0.094px] whitespace-nowrap">{data.retentionBadge}</p>
    </div>
  );
}

function Container11() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full" data-name="Container">
      <OverlayOverlayBlur />
      <Background1 />
    </div>
  );
}

function Frame() {
  const { data } = useDashboardData();
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[92px] justify-center leading-[0] not-italic relative shrink-0 text-[84px] text-white tracking-[-1.25px] w-[255px] transition-opacity duration-200">
        <p className="leading-[37px]">{data.retention}</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
      <Frame />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[17.92px] text-white tracking-[-0.642px] w-[min-content]">
        <p className="leading-[normal]">Retention rate</p>
      </div>
    </div>
  );
}

function LargeHeroCard() {
  return (
    <div className="content-stretch flex flex-col aspect-[53/34] min-h-[172px] items-start justify-between overflow-clip pb-[12px] pt-[10px] px-[16px] relative rounded-[10px] shadow-[0px_6.69px_8.362px_-1.673px_rgba(0,0,0,0.1),0px_2.676px_3.345px_-2.007px_rgba(0,0,0,0.1)] flex-[295.819_1_0] min-w-0 transition-shadow duration-200 hover:shadow-[0px_10px_20px_-2px_rgba(86,41,230,0.35),0px_4px_8px_-2px_rgba(86,41,230,0.2)] cursor-default" style={{ backgroundImage: "linear-gradient(142.07828029689713deg, rgb(111, 75, 255) 0%, rgb(86, 41, 230) 100%)" }} data-name="Large Hero Card">
      <SparklineVisualizationPlaceholder />
      <Container11 />
      <Frame5 />
    </div>
  );
}

// Mock trend data for the four KPI card sparklines. These are
// presentational-only trend lines (not tied to the date-range selector's
// dataset) — they communicate general trend direction for each metric,
// not literal historical values.
const REVENUE_TREND = [38, 42, 40, 47, 51, 49, 58, 62];
const DAU_TREND = [180, 205, 195, 220, 210, 240, 235, 260];
const AVG_SESSION_TREND = [9, 10, 9.5, 11, 12, 11.5, 13, 13.5];
const DROP_OFF_TREND = [18, 17, 16.5, 15, 15.5, 14, 14.6, 13.8];

function Container13() {
  const { data } = useDashboardData();
  return (
    <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(2,fit-content(100%))] gap-[16px] relative flex-[514.118_1_0] min-w-0" data-name="Container">
      <KpiCard
        title="Revenue"
        value={data.revenue}
        caption="Total evenue"
        sparklineData={REVENUE_TREND}
        className="col-1 row-1 self-stretch justify-self-stretch shrink-0"
      />
      <KpiCard
        title="DAU"
        value={data.dau}
        caption="Total evenue"
        sparklineData={DAU_TREND}
        className="col-2 row-1 self-stretch justify-self-stretch shrink-0"
      />
      <KpiCard
        title="Average Session"
        value={data.avgSession}
        caption="Total evenue"
        sparklineData={AVG_SESSION_TREND}
        className="col-1 row-2 self-stretch justify-self-stretch shrink-0"
      />
      <KpiCard
        title="Drop Off Rate"
        value={data.dropOff}
        caption="Total evenue"
        sparklineData={DROP_OFF_TREND}
        className="col-2 row-2 self-stretch justify-self-stretch shrink-0"
      />
    </div>
  );
}

function SectionKpiRow() {
  return (
    <div className="content-start flex flex-wrap gap-[28px_28px] items-start relative shrink-0 w-full" data-name="Section - KPI Row">
      <LargeHeroCard />
      <Container13 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[16px] w-full">
        <p className="leading-[24px]">Player Funnel Performance</p>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[13.338px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="23.8185" preserveAspectRatio="none" viewBox="0 0 23.8185 23.8185" width="23.8185">
        <g id="Icon">
          <path d={svgPaths.p2dbe8800} id="Vector" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d={svgPaths.p1ba4a900} id="Vector_2" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
        </g>
      </svg>
    </div>
  );
}

function Container25() {
  return (
    <div className="bg-[#f3f4f6] min-w-[40px] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center min-w-[inherit] relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="min-w-[104px] relative shrink-0 w-[104px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">Sign Up</p>
      </div>
    </div>
  );
}

function Text10() {
  const { data } = useDashboardData();
  return (
    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-white text-[16px] tracking-[-0.096px] whitespace-nowrap">{data.funnel[0].pct}%</p>
  );
}

function Container28() {
  const { data } = useDashboardData();
  const pct = data.funnel[0].pct;
  return (
    <div className="group/bar bg-gradient-to-r from-[#7060ec] h-[40px] relative rounded-[10px] shrink-0 to-[#9487f7] transition-[width,filter] duration-300 ease-out hover:brightness-105 cursor-default" style={{ width: `${pct}%` }} data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-end pr-[14px] relative size-full">
        <Text10 />
      </div>
      <div className="pointer-events-none absolute -top-[38px] right-0 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)]">
        {pct}% • Sign Up
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="bg-[#f3f4f6] flex-[202_0_0] h-[40px] min-w-px relative rounded-[10px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container28 />
      </div>
    </div>
  );
}

function Container24() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container25 />
        <Container26 />
        <Container27 />
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[13.338px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="23.8185" preserveAspectRatio="none" viewBox="0 0 23.8185 23.8185" width="23.8185">
        <g id="Icon">
          <path d={svgPaths.p1d137570} id="Vector" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d="M21.8336 9.92433V15.879" id="Vector_2" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d={svgPaths.p3db99a00} id="Vector_3" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
        </g>
      </svg>
    </div>
  );
}

function Container30() {
  return (
    <div className="bg-[#f3f4f6] min-w-[40px] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center min-w-[inherit] relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Container32() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">Tutorial</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">Completed</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="min-w-[104px] relative shrink-0 w-[104px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <Container32 />
        <Container33 />
      </div>
    </div>
  );
}

function Text11() {
  const { data } = useDashboardData();
  return (
    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-white text-[16px] tracking-[-0.096px] whitespace-nowrap">{data.funnel[1].pct}%</p>
  );
}

function Container35() {
  const { data } = useDashboardData();
  const pct = data.funnel[1].pct;
  return (
    <div className="group/bar bg-gradient-to-r from-[#7e6ff4] h-[40px] relative rounded-[10px] shrink-0 to-[#a89cf9] transition-[width,filter] duration-300 ease-out hover:brightness-105 cursor-default" style={{ width: `${pct}%` }} data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-end pr-[14px] relative size-full">
        <Text11 />
      </div>
      <div className="pointer-events-none absolute -top-[38px] right-0 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)]">
        {pct}% • Tutorial Completed
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="bg-[#f3f4f6] flex-[202_0_0] h-[40px] min-w-px relative rounded-[10px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container35 />
      </div>
    </div>
  );
}

function Container29() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container30 />
        <Container31 />
        <Container34 />
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[13.338px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="23.8185" preserveAspectRatio="none" viewBox="0 0 23.8185 23.8185" width="23.8185">
        <g id="Icon">
          <path d={svgPaths.p135ad300} id="Vector" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d={svgPaths.p2a54b300} id="Vector_2" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d={svgPaths.p3d0d7080} id="Vector_3" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
        </g>
      </svg>
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-[#f3f4f6] min-w-[40px] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center min-w-[inherit] relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="min-w-[104px] relative shrink-0 w-[104px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">First Match</p>
      </div>
    </div>
  );
}

function Text12() {
  const { data } = useDashboardData();
  return (
    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-white text-[16px] tracking-[-0.096px] whitespace-nowrap">{data.funnel[2].pct}%</p>
  );
}

function Container40() {
  const { data } = useDashboardData();
  const pct = data.funnel[2].pct;
  return (
    <div className="group/bar bg-gradient-to-r from-[#9487f7] h-[40px] relative rounded-[10px] shrink-0 to-[#bcb4fb] transition-[width,filter] duration-300 ease-out hover:brightness-105 cursor-default" style={{ width: `${pct}%` }} data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-end pr-[14px] relative size-full">
        <Text12 />
      </div>
      <div className="pointer-events-none absolute -top-[38px] right-0 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)]">
        {pct}% • First Match
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-[#f3f4f6] flex-[202_0_0] h-[40px] min-w-px relative rounded-[10px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container40 />
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container37 />
        <Container38 />
        <Container39 />
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[13.338px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="23.8185" preserveAspectRatio="none" viewBox="0 0 23.8185 23.8185" width="23.8185">
        <g id="Icon">
          <path d="M7.93944 1.98487V5.95462" id="Vector" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d="M15.879 1.98487V5.95462" id="Vector_2" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d={svgPaths.p1aad5b00} id="Vector_3" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d="M2.97727 9.92445H20.8411" id="Vector_4" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d="M7.93944 13.8942H7.9493" id="Vector_5" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d="M11.9092 13.8942H11.919" id="Vector_6" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d="M15.879 13.8942H15.8888" id="Vector_7" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d="M7.93944 17.8639H7.9493" id="Vector_8" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d="M11.9092 17.8639H11.919" id="Vector_9" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d="M15.879 17.8639H15.8888" id="Vector_10" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
        </g>
      </svg>
    </div>
  );
}

function Container42() {
  return (
    <div className="bg-[#f3f4f6] min-w-[40px] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center min-w-[inherit] relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Container44() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">Next Day</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">Return</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="min-w-[104px] relative shrink-0 w-[104px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <Container44 />
        <Container45 />
      </div>
    </div>
  );
}

function Text13() {
  const { data } = useDashboardData();
  return (
    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-[#7060ec] text-[16px] tracking-[-0.096px] whitespace-nowrap">{data.funnel[3].pct}%</p>
  );
}

function Container47() {
  const { data } = useDashboardData();
  const pct = data.funnel[3].pct;
  return (
    <div className="group/bar bg-gradient-to-r from-[#bcb4fb] h-[40px] relative rounded-[10px] shrink-0 to-[#d4cffd] transition-[width,filter] duration-300 ease-out hover:brightness-105 cursor-default" style={{ width: `${pct}%` }} data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-end pr-[14px] relative size-full">
        <Text13 />
      </div>
      <div className="pointer-events-none absolute -top-[38px] right-0 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)]">
        {pct}% • Next Day Return
      </div>
    </div>
  );
}

function Container46() {
  return (
    <div className="bg-[#f3f4f6] flex-[202_0_0] h-[40px] min-w-px relative rounded-[10px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container47 />
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container42 />
        <Container43 />
        <Container46 />
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[13.338px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="23.8185" preserveAspectRatio="none" viewBox="0 0 23.8185 23.8185" width="23.8185">
        <g id="Icon">
          <path d={svgPaths.p1a9de00} id="Vector" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d={svgPaths.p2a28f300} id="Vector_2" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
          <path d={svgPaths.p2a80a0c0} id="Vector_3" stroke="#1E293B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5879" />
        </g>
      </svg>
    </div>
  );
}

function Container49() {
  return (
    <div className="bg-[#f3f4f6] min-w-[40px] relative rounded-[10px] shrink-0 size-[40px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center min-w-[inherit] relative size-full">
        <Icon7 />
      </div>
    </div>
  );
}

function Container51() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">First</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic relative shrink-0 text-[#1e293b] text-[16px] whitespace-nowrap">Purchase</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="min-w-[104px] relative shrink-0 w-[104px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <Container51 />
        <Container52 />
      </div>
    </div>
  );
}

function Text14() {
  const { data } = useDashboardData();
  return (
    <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic text-[#8b6200] text-[16px] tracking-[-0.096px] whitespace-nowrap">{data.funnel[4].pct}%</p>
  );
}

function Container54() {
  const { data } = useDashboardData();
  const pct = data.funnel[4].pct;
  return (
    <div className="group/bar bg-gradient-to-r from-[#f5c53a] h-[40px] relative rounded-[10px] shrink-0 to-[#f8d96b] transition-[width,filter] duration-300 ease-out hover:brightness-105 cursor-default" style={{ width: `${pct}%` }} data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-end pr-[14px] relative size-full">
        <Text14 />
      </div>
      <div className="pointer-events-none absolute -top-[38px] right-0 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)]">
        {pct}% • First Purchase
      </div>
    </div>
  );
}

function Container53() {
  return (
    <div className="bg-[#f3f4f6] flex-[202_0_0] h-[40px] min-w-px relative rounded-[10px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
        <Container54 />
      </div>
    </div>
  );
}

function Container48() {
  return (
    <div className="h-[48px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container49 />
        <Container50 />
        <Container53 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-full" data-name="Container">
      <Container24 />
      <Container29 />
      <Container36 />
      <Container41 />
      <Container48 />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container (margin)">
      <Container23 />
    </div>
  );
}

function PlayerFunnelPerformance() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start px-[20px] py-[20px] relative rounded-[11.162px] flex-[289.52_1_0] min-w-0" data-name="Player Funnel Performance">
      <Heading2 />
      <ContainerMargin />
    </div>
  );
}

function Text15() {
  const { data } = useDashboardData();
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic text-[#7b6cf5] text-[16px] whitespace-nowrap relative shrink-0 transition-opacity duration-200">{data.revenueBars[0].value}</p>
    </div>
  );
}

function Icon8() {
  const { data } = useDashboardData();
  const barHeight = data.revenueBars[0].height;
  return (
    <div className="group/revbar relative shrink-0 w-[53.2px] transition-[height] duration-300 ease-out cursor-default" style={{ height: `${barHeight}px` }} data-name="Icon">
      <svg className="absolute block inset-0 size-full transition-[filter] duration-150 group-hover/revbar:brightness-110" fill="none" preserveAspectRatio="none" viewBox="0 0 95 300">
        <g clipPath="url(#clip0_0_84)" id="Icon">
          <path d={svgPaths.p2b8ed000} fill="url(#paint0_linear_0_84)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_84" x1="0" x2="95" y1="0" y2="0">
            <stop stopColor="#9D8FF9" />
            <stop offset="1" stopColor="#5A4DC8" />
          </linearGradient>
          <clipPath id="clip0_0_84">
            <rect fill="white" height="300" width="95" />
          </clipPath>
        </defs>
      </svg>
      <div className="pointer-events-none absolute -top-[36px] left-1/2 -translate-x-1/2 opacity-0 group-hover/revbar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        Battle Pass: {data.revenueBars[0].value}
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic text-[#1e293b] text-[16px] text-center w-full">Battle Pass</p>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 w-full min-w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Text15 />
        <Icon8 />
        <Text16 />
      </div>
    </div>
  );
}

function Text17() {
  const { data } = useDashboardData();
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic text-[#7b6cf5] text-[16px] whitespace-nowrap relative shrink-0 transition-opacity duration-200">{data.revenueBars[1].value}</p>
    </div>
  );
}

function Icon9() {
  const { data } = useDashboardData();
  const barHeight = data.revenueBars[1].height;
  return (
    <div className="group/revbar relative shrink-0 w-[53.2px] transition-[height] duration-300 ease-out cursor-default" style={{ height: `${barHeight}px` }} data-name="Icon">
      <svg className="absolute block inset-0 size-full transition-[filter] duration-150 group-hover/revbar:brightness-110" fill="none" preserveAspectRatio="none" viewBox="0 0 95 264">
        <g clipPath="url(#clip0_0_119)" id="Icon">
          <path d={svgPaths.p380200} fill="url(#paint0_linear_0_119)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_119" x1="0" x2="95" y1="0" y2="0">
            <stop stopColor="#ADA2F5" />
            <stop offset="1" stopColor="#6E64C6" />
          </linearGradient>
          <clipPath id="clip0_0_119">
            <rect fill="white" height="264" width="95" />
          </clipPath>
        </defs>
      </svg>
      <div className="pointer-events-none absolute -top-[36px] left-1/2 -translate-x-1/2 opacity-0 group-hover/revbar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        Bundles: {data.revenueBars[1].value}
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic text-[#1e293b] text-[16px] text-center w-full">Bundles</p>
    </div>
  );
}

function Container56() {
  return (
    <div className="relative shrink-0 w-full min-w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Text17 />
        <Icon9 />
        <Text18 />
      </div>
    </div>
  );
}

function Text19() {
  const { data } = useDashboardData();
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic text-[#8575f6] text-[16px] whitespace-nowrap relative shrink-0 transition-opacity duration-200">{data.revenueBars[2].value}</p>
    </div>
  );
}

function Icon10() {
  const { data } = useDashboardData();
  const barHeight = data.revenueBars[2].height;
  return (
    <div className="group/revbar relative shrink-0 w-[53.2px] transition-[height] duration-300 ease-out cursor-default" style={{ height: `${barHeight}px` }} data-name="Icon">
      <svg className="absolute block inset-0 size-full transition-[filter] duration-150 group-hover/revbar:brightness-110" fill="none" preserveAspectRatio="none" viewBox="0 0 95 222">
        <g clipPath="url(#clip0_0_129)" id="Icon">
          <path d={svgPaths.p3fade6c0} fill="url(#paint0_linear_0_129)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_129" x1="0" x2="95" y1="0" y2="0">
            <stop stopColor="#B7ACFA" />
            <stop offset="1" stopColor="#8378D9" />
          </linearGradient>
          <clipPath id="clip0_0_129">
            <rect fill="white" height="222" width="95" />
          </clipPath>
        </defs>
      </svg>
      <div className="pointer-events-none absolute -top-[36px] left-1/2 -translate-x-1/2 opacity-0 group-hover/revbar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        Skins: {data.revenueBars[2].value}
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic text-[#1e293b] text-[16px] text-center w-full">Skins</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 w-full min-w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Text19 />
        <Icon10 />
        <Text20 />
      </div>
    </div>
  );
}

function Text21() {
  const { data } = useDashboardData();
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic text-[#7b6cf5] text-[16px] whitespace-nowrap relative shrink-0 transition-opacity duration-200">{data.revenueBars[3].value}</p>
    </div>
  );
}

function Icon11() {
  const { data } = useDashboardData();
  const barHeight = data.revenueBars[3].height;
  return (
    <div className="group/revbar relative shrink-0 w-[53.2px] transition-[height] duration-300 ease-out cursor-default" style={{ height: `${barHeight}px` }} data-name="Icon">
      <svg className="absolute block inset-0 size-full transition-[filter] duration-150 group-hover/revbar:brightness-110" fill="none" preserveAspectRatio="none" viewBox="0 0 95 177">
        <g clipPath="url(#clip0_0_22)" id="Icon">
          <path d={svgPaths.p14476580} fill="url(#paint0_linear_0_22)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_22" x1="0" x2="95" y1="0" y2="0">
            <stop stopColor="#C4BDF3" />
            <stop offset="1" stopColor="#918AC9" />
          </linearGradient>
          <clipPath id="clip0_0_22">
            <rect fill="white" height="177" width="95" />
          </clipPath>
        </defs>
      </svg>
      <div className="pointer-events-none absolute -top-[36px] left-1/2 -translate-x-1/2 opacity-0 group-hover/revbar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        Season Pass: {data.revenueBars[3].value}
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic text-[#1e293b] text-[16px] text-center w-full">Season Pass</p>
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0 w-full min-w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Text21 />
        <Icon11 />
        <Text22 />
      </div>
    </div>
  );
}

function Text23() {
  const { data } = useDashboardData();
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[20px] not-italic text-[#8b6200] text-[16px] whitespace-nowrap relative shrink-0 transition-opacity duration-200">{data.revenueBars[4].value}</p>
    </div>
  );
}

function Icon12() {
  const { data } = useDashboardData();
  const barHeight = data.revenueBars[4].height;
  return (
    <div className="group/revbar relative shrink-0 w-[53.2px] transition-[height] duration-300 ease-out cursor-default" style={{ height: `${barHeight}px` }} data-name="Icon">
      <svg className="absolute block inset-0 size-full transition-[filter] duration-150 group-hover/revbar:brightness-110" fill="none" preserveAspectRatio="none" viewBox="0 0 95 126">
        <g clipPath="url(#clip0_0_16)" id="Icon">
          <path d={svgPaths.p982ad00} fill="url(#paint0_linear_0_16)" id="Vector" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_16" x1="0" x2="95" y1="0" y2="0">
            <stop stopColor="#FAE07A" />
            <stop offset="1" stopColor="#D49A10" />
          </linearGradient>
          <clipPath id="clip0_0_16">
            <rect fill="white" height="126" width="95" />
          </clipPath>
        </defs>
      </svg>
      <div className="pointer-events-none absolute -top-[36px] left-1/2 -translate-x-1/2 opacity-0 group-hover/revbar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        Coins: {data.revenueBars[4].value}
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[20px] not-italic text-[#1e293b] text-[16px] text-center w-full">Coins</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0 w-full min-w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[8px] items-center relative size-full">
        <Text23 />
        <Icon12 />
        <Text24 />
      </div>
    </div>
  );
}

function FlatBarChart() {
  return (
    <div className="grid grid-cols-[repeat(5,minmax(0,1fr))] gap-x-[16px] items-end px-[20px] py-[16px] relative shrink-0 w-full" data-name="FlatBarChart">
      <Container55 />
      <Container56 />
      <Container57 />
      <Container58 />
      <Container59 />
    </div>
  );
}

function RevenueBreakdown() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[24px] items-start px-[20px] py-[20px] relative rounded-[13.028px] flex-[508_1_0] min-w-0" data-name="Revenue Breakdown">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Medium',sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[16px] w-full">
        <p className="leading-[24px]">Revenue Breakdown</p>
      </div>
      <FlatBarChart />
    </div>
  );
}

function MiddleSection() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="Middle Section">
      <PlayerFunnelPerformance />
      <RevenueBreakdown />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[11.582px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.6822" preserveAspectRatio="none" viewBox="0 0 20.6822 20.6822" width="20.6822">
        <g id="Icon">
          <path d={svgPaths.p107e3f60} id="Vector" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
          <path d="M6.89407 18.0969H13.7881" id="Vector_2" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
          <path d="M10.3411 14.65V18.0971" id="Vector_3" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
        </g>
      </svg>
    </div>
  );
}

function Container63() {
  return (
    <div className="bg-[#ede9fe] relative rounded-[6.618px] shrink-0 size-[23.164px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon13 />
      </div>
    </div>
  );
}

function Text25() {
  return (
    <div className="relative shrink-0 flex items-start w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic text-[#111827] text-[16px] whitespace-nowrap relative shrink-0">Popular Screens</p>
    </div>
  );
}

function Container62() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container63 />
        <Text25 />
      </div>
    </div>
  );
}

function Text26() {
  return (
    <button type="button" className="relative shrink-0 flex items-start w-full cursor-pointer text-left">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[22px] not-italic text-[#7b6cf5] text-[16px] whitespace-nowrap relative shrink-0 transition-colors duration-150 hover:text-[#4c2e9e] underline-offset-2 hover:underline">View all</p>
    </button>
  );
}

function Container61() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between gap-[16px] relative size-full">
        <Container62 />
        <Text26 />
      </div>
    </div>
  );
}

function Container64() {
  return <div className="bg-[#7b6cf5] h-[4.136px] opacity-85 relative rounded-[2.482px] shrink-0 w-[23.164px]" data-name="Container" />;
}

function Text27() {
  return (
    <div className="relative flex items-start w-full min-w-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#374151] text-[16px] whitespace-nowrap">Battle Pass</p>
    </div>
  );
}

function TableRow() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_60px_68px_68px] gap-x-[16px] items-center py-[11px] border-b border-[#f3f4f6] w-full -mx-[20px] px-[20px] transition-colors duration-150 hover:bg-[#f8fafc]" data-name="Table Row">
      <div className="flex gap-[10px] items-center min-w-0">
        <Container64 />
        <Text27 />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">45.2K</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">2m 01s</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">45.2%</p>
    </div>
  );
}

function Container65() {
  return <div className="bg-[#7b6cf5] h-[4.136px] opacity-85 relative rounded-[2.482px] shrink-0 w-[23.164px]" data-name="Container" />;
}

function Text28() {
  return (
    <div className="relative flex items-start w-full min-w-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#374151] text-[16px] whitespace-nowrap">Store</p>
    </div>
  );
}

function TableRow1() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_60px_68px_68px] gap-x-[16px] items-center py-[11px] border-b border-[#f3f4f6] w-full -mx-[20px] px-[20px] transition-colors duration-150 hover:bg-[#f8fafc]" data-name="Table Row">
      <div className="flex gap-[10px] items-center min-w-0">
        <Container65 />
        <Text28 />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">38.1K</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">2m 01s</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">38.1%</p>
    </div>
  );
}

function Container66() {
  return <div className="bg-[#7b6cf5] h-[4.136px] opacity-85 relative rounded-[2.482px] shrink-0 w-[23.164px]" data-name="Container" />;
}

function Text29() {
  return (
    <div className="relative flex items-start w-full min-w-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#374151] text-[16px] whitespace-nowrap">Profile</p>
    </div>
  );
}

function TableRow2() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_60px_68px_68px] gap-x-[16px] items-center py-[11px] border-b border-[#f3f4f6] w-full -mx-[20px] px-[20px] transition-colors duration-150 hover:bg-[#f8fafc]" data-name="Table Row">
      <div className="flex gap-[10px] items-center min-w-0">
        <Container66 />
        <Text29 />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">22.4K</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">2m 01s</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">22.4%</p>
    </div>
  );
}

function Container67() {
  return <div className="bg-[#f5c53a] h-[4.136px] opacity-85 relative rounded-[2.482px] shrink-0 w-[23.164px]" data-name="Container" />;
}

function Text30() {
  return (
    <div className="relative flex items-start w-full min-w-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#374151] text-[16px] whitespace-nowrap">Lobby</p>
    </div>
  );
}

function TableRow3() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_60px_68px_68px] gap-x-[16px] items-center py-[11px] border-b border-[#f3f4f6] w-full -mx-[20px] px-[20px] transition-colors duration-150 hover:bg-[#f8fafc]" data-name="Table Row">
      <div className="flex gap-[10px] items-center min-w-0">
        <Container67 />
        <Text30 />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">18.3K</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">2m 01s</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">18.3%</p>
    </div>
  );
}

function Container68() {
  return <div className="bg-[#f5c53a] h-[4.136px] opacity-85 relative rounded-[2.482px] shrink-0 w-[23.164px]" data-name="Container" />;
}

function Text31() {
  return (
    <div className="relative flex items-start w-full min-w-0" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#374151] text-[16px] whitespace-nowrap">Home</p>
    </div>
  );
}

function TableRow4() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_60px_68px_68px] gap-x-[16px] items-center py-[11px] w-full -mx-[20px] px-[20px] transition-colors duration-150 hover:bg-[#f8fafc]" data-name="Table Row">
      <div className="flex gap-[10px] items-center min-w-0">
        <Container68 />
        <Text31 />
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">18.3K</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">2m 01s</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">18.3%</p>
    </div>
  );
}

function PopularScreensHeaderRow() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_60px_68px_68px] gap-x-[16px] items-center pb-[10px] border-b border-[#f3f4f6] w-full" data-name="Header Row">
      <p className="font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[16px] tracking-[0.347px] uppercase whitespace-nowrap">Screen</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[16px] text-right tracking-[0.347px] uppercase whitespace-nowrap">Views</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[16px] text-right tracking-[0.347px] uppercase whitespace-nowrap">Avg Time</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[16px] text-right tracking-[0.347px] uppercase whitespace-nowrap">Exit Rate</p>
    </div>
  );
}

function Table() {
  return (
    <div className="relative shrink-0 w-full flex flex-col gap-0" data-name="Table">
      <PopularScreensHeaderRow />
      <TableRow />
      <TableRow1 />
      <TableRow2 />
      <TableRow3 />
      <TableRow4 />
    </div>
  );
}

function TableMargin() {
  return (
    <div className="relative shrink-0 w-full" data-name="Table (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Table />
      </div>
    </div>
  );
}

function Container60() {
  return (
    <div className="bg-white drop-shadow-[0px_1.655px_6.618px_rgba(0,0,0,0.06)] flex-[317.333_1_0] min-w-0 relative rounded-[13.237px] transition-shadow duration-200 hover:shadow-[0px_8px_20px_-4px_rgba(15,23,42,0.14)] cursor-default" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start gap-[14px] px-[20px] py-[16px] relative size-full">
        <Container61 />
        <TableMargin />
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[11.582px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.6822" preserveAspectRatio="none" viewBox="0 0 20.6822 20.6822" width="20.6822">
        <g id="Icon">
          <path d={svgPaths.p1f0c7f00} id="Vector" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
        </g>
      </svg>
    </div>
  );
}

function Container72() {
  return (
    <div className="bg-[#ede9fe] relative rounded-[6.618px] shrink-0 size-[23.164px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon14 />
      </div>
    </div>
  );
}

function Text32() {
  return (
    <div className="relative shrink-0 flex items-start w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic text-[#111827] text-[16px] whitespace-nowrap relative shrink-0">Feature Adoption</p>
    </div>
  );
}

function Container71() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container72 />
        <Text32 />
      </div>
    </div>
  );
}

function Text33() {
  return (
    <button type="button" className="relative shrink-0 flex items-start w-full cursor-pointer text-left">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[22px] not-italic text-[#7b6cf5] text-[16px] whitespace-nowrap relative shrink-0 transition-colors duration-150 hover:text-[#4c2e9e] underline-offset-2 hover:underline">View all</p>
    </button>
  );
}

function Container70() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between gap-[16px] relative size-full">
        <Container71 />
        <Text33 />
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[9.928px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="17.7276" preserveAspectRatio="none" viewBox="0 0 17.7276 17.7276" width="17.7276">
        <g id="Icon">
          <path d={svgPaths.p27a5fc80} id="Vector" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
          <path d={svgPaths.p100b9c00} id="Vector_2" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
        </g>
      </svg>
    </div>
  );
}

function Container74() {
  return (
    <div className="bg-[#ede9fe] relative rounded-[4.964px] shrink-0 size-[18.201px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon15 />
      </div>
    </div>
  );
}

function Container73() {
  return (
    <div className="flex items-center justify-end" data-name="Container">
      <Container74 />
    </div>
  );
}

function TableRow5() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px_68px_44px] gap-x-[16px] items-center py-[11px] border-b border-[#f3f4f6] w-full -mx-[20px] px-[20px] transition-colors duration-150 hover:bg-[#f8fafc]" data-name="Table Row">
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#374151] text-[16px] whitespace-nowrap">Daily Challenges</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">45.2K</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">85%</p>
      <Container73 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[9.928px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="17.7276" preserveAspectRatio="none" viewBox="0 0 17.7276 17.7276" width="17.7276">
        <g id="Icon">
          <path d={svgPaths.p1e11abb0} id="Vector" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
          <path d={svgPaths.p196200c0} id="Vector_2" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
        </g>
      </svg>
    </div>
  );
}

function Container76() {
  return (
    <div className="bg-[#ede9fe] relative rounded-[4.964px] shrink-0 size-[18.201px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon16 />
      </div>
    </div>
  );
}

function Container75() {
  return (
    <div className="flex items-center justify-end" data-name="Container">
      <Container76 />
    </div>
  );
}

function TableRow6() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px_68px_44px] gap-x-[16px] items-center py-[11px] border-b border-[#f3f4f6] w-full -mx-[20px] px-[20px] transition-colors duration-150 hover:bg-[#f8fafc]" data-name="Table Row">
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#374151] text-[16px] whitespace-nowrap">Battle Pass</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">38.1K</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">12%</p>
      <Container75 />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[9.928px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="17.7276" preserveAspectRatio="none" viewBox="0 0 17.7276 17.7276" width="17.7276">
        <g id="Icon">
          <path d={svgPaths.p22811ec0} id="Vector" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
          <path d={svgPaths.p3d12cb80} id="Vector_2" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
        </g>
      </svg>
    </div>
  );
}

function Container78() {
  return (
    <div className="bg-[#ede9fe] relative rounded-[4.964px] shrink-0 size-[18.201px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon17 />
      </div>
    </div>
  );
}

function Container77() {
  return (
    <div className="flex items-center justify-end" data-name="Container">
      <Container78 />
    </div>
  );
}

function TableRow7() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px_68px_44px] gap-x-[16px] items-center py-[11px] border-b border-[#f3f4f6] w-full -mx-[20px] px-[20px] transition-colors duration-150 hover:bg-[#f8fafc]" data-name="Table Row">
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#374151] text-[16px] whitespace-nowrap">Ranked Mode</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">22.4K</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">43%</p>
      <Container77 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[9.928px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="17.7276" preserveAspectRatio="none" viewBox="0 0 17.7276 17.7276" width="17.7276">
        <g id="Icon">
          <path d="M3.69323 8.86374H14.0343" id="Vector" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
          <path d={svgPaths.p9c14000} id="Vector_2" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
        </g>
      </svg>
    </div>
  );
}

function Container80() {
  return (
    <div className="bg-[#fef3c7] relative rounded-[4.964px] shrink-0 size-[18.201px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Container79() {
  return (
    <div className="flex items-center justify-end" data-name="Container">
      <Container80 />
    </div>
  );
}

function TableRow8() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px_68px_44px] gap-x-[16px] items-center py-[11px] border-b border-[#f3f4f6] w-full -mx-[20px] px-[20px] transition-colors duration-150 hover:bg-[#f8fafc]" data-name="Table Row">
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#374151] text-[16px] whitespace-nowrap">Voice Chat</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">18.3K</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">88%</p>
      <Container79 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[9.928px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="17.7276" preserveAspectRatio="none" viewBox="0 0 17.7276 17.7276" width="17.7276">
        <g id="Icon">
          <path d={svgPaths.p11421580} id="Vector" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
          <path d={svgPaths.p2b058a60} id="Vector_2" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.84662" />
        </g>
      </svg>
    </div>
  );
}

function Container82() {
  return (
    <div className="bg-[#fee2e2] relative rounded-[4.964px] shrink-0 size-[18.201px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon19 />
      </div>
    </div>
  );
}

function Container81() {
  return (
    <div className="flex items-center justify-end" data-name="Container">
      <Container82 />
    </div>
  );
}

function TableRow9() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px_68px_44px] gap-x-[16px] items-center py-[11px] w-full -mx-[20px] px-[20px] transition-colors duration-150 hover:bg-[#f8fafc]" data-name="Table Row">
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#374151] text-[16px] whitespace-nowrap">Clan System</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">18.3K</p>
      <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#6b7280] text-[16px] text-right whitespace-nowrap">44%</p>
      <Container81 />
    </div>
  );
}

function FeatureAdoptionHeaderRow() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_56px_68px_44px] gap-x-[16px] items-center pb-[10px] border-b border-[#f3f4f6] w-full" data-name="Header Row">
      <p className="font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[16px] tracking-[0.347px] uppercase whitespace-nowrap">Feature</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[16px] text-right tracking-[0.347px] uppercase whitespace-nowrap">Users</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[16px] text-right tracking-[0.347px] uppercase whitespace-nowrap">Adoption</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium not-italic text-[#9ca3af] text-[16px] text-right tracking-[0.347px] uppercase whitespace-nowrap">Trend</p>
    </div>
  );
}

function Table1() {
  return (
    <div className="relative shrink-0 w-full flex flex-col gap-0" data-name="Table">
      <FeatureAdoptionHeaderRow />
      <TableRow5 />
      <TableRow6 />
      <TableRow7 />
      <TableRow8 />
      <TableRow9 />
    </div>
  );
}

function TableMargin1() {
  return (
    <div className="relative shrink-0" data-name="Table (margin)">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Table1 />
      </div>
    </div>
  );
}

function Container69() {
  return (
    <div className="bg-white drop-shadow-[0px_1.655px_6.618px_rgba(0,0,0,0.06)] flex-[317.333_1_0] min-w-0 relative rounded-[13.237px] transition-shadow duration-200 hover:shadow-[0px_8px_20px_-4px_rgba(15,23,42,0.14)] cursor-default" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start gap-[14px] px-[20px] py-[16px] relative size-full">
        <Container70 />
        <TableMargin1 />
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="relative shrink-0 size-[11.582px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="20.6822" preserveAspectRatio="none" viewBox="0 0 20.6822 20.6822" width="20.6822">
        <g id="Icon">
          <path d={svgPaths.p33303f00} id="Vector" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
          <path d={svgPaths.p3706e780} id="Vector_2" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.72351" />
        </g>
      </svg>
    </div>
  );
}

function Container86() {
  return (
    <div className="bg-[#ede9fe] relative rounded-[6.618px] shrink-0 size-[23.164px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon20 />
      </div>
    </div>
  );
}

function Text34() {
  return (
    <div className="relative shrink-0 flex items-start w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[22px] not-italic text-[#111827] text-[16px] whitespace-nowrap relative shrink-0">{`Alerts & Notifications`}</p>
    </div>
  );
}

function Container85() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container86 />
        <Text34 />
      </div>
    </div>
  );
}

function Text35() {
  return (
    <button type="button" className="relative shrink-0 flex items-start w-full cursor-pointer text-left">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[22px] not-italic text-[#7b6cf5] text-[16px] whitespace-nowrap relative shrink-0 transition-colors duration-150 hover:text-[#4c2e9e] underline-offset-2 hover:underline">View all</p>
    </button>
  );
}

function Container84() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between gap-[16px] relative size-full">
        <Container85 />
        <Text35 />
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[10.755px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="19.2049" preserveAspectRatio="none" viewBox="0 0 19.2049 19.2049" width="19.2049">
        <g id="Icon">
          <path d={svgPaths.p1430c180} id="Vector" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
          <path d={svgPaths.p6c19500} id="Vector_2" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
        </g>
      </svg>
    </div>
  );
}

function Container89() {
  return (
    <div className="bg-[#ede9fe] relative rounded-[5.791px] shrink-0 size-[21.51px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon21 />
      </div>
    </div>
  );
}

function Container90() {
  return (
    <div className="flex-1 min-w-0 relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[22px] not-italic relative text-[#374151] text-[16px] min-w-0 w-full">Retention improved</p>
      </div>
    </div>
  );
}

function Text36() {
  return (
    <div className="relative shrink-0 flex items-start w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#9ca3af] text-[16px] whitespace-nowrap relative shrink-0">2h ago</p>
    </div>
  );
}

function Container92() {
  return <div className="bg-[#7b6cf5] relative rounded-[3.309px] shrink-0 size-[6.618px]" data-name="Container" />;
}

function Container91() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text36 />
        <Container92 />
      </div>
    </div>
  );
}

function Container88() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f3f4f6] border-b-[0.735px] border-solid inset-0 pointer-events-none" />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[11px] pt-[10px] relative size-full -mx-[20px] px-[20px] w-[calc(100%+40px)] cursor-pointer text-left transition-colors duration-150 hover:bg-[#f8fafc]"
      >
        <Container89 />
        <Container90 />
        <Container91 />
      </button>
      {expanded && (
        <div className="pb-[12px] pr-[8px] pl-[44px] -mt-[2px]">
          <p className="text-[14px] leading-[20px] text-[#6b7280]">Day-7 retention rose to 45.2%, up from 41.8% last period. Biggest gains came from the Tutorial → First Match step.</p>
        </div>
      )}
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[10.755px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="19.2049" preserveAspectRatio="none" viewBox="0 0 19.2049 19.2049" width="19.2049">
        <g id="Icon">
          <path d={svgPaths.p16f47800} id="Vector" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
          <path d="M9.60244 7.20175V10.4026" id="Vector_2" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
          <path d="M9.60244 13.6032H9.61038" id="Vector_3" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
        </g>
      </svg>
    </div>
  );
}

function Container94() {
  return (
    <div className="bg-[#fef3c7] relative rounded-[5.791px] shrink-0 size-[21.51px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon22 />
      </div>
    </div>
  );
}

function Container95() {
  return (
    <div className="flex-1 min-w-0 relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[22px] not-italic relative text-[#374151] text-[16px] min-w-0 w-full">Drop Off increased</p>
      </div>
    </div>
  );
}

function Text37() {
  return (
    <div className="relative shrink-0 flex items-start w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#9ca3af] text-[16px] whitespace-nowrap relative shrink-0">4h ago</p>
    </div>
  );
}

function Container97() {
  return <div className="bg-[#f59e0b] relative rounded-[3.309px] shrink-0 size-[6.618px]" data-name="Container" />;
}

function Container96() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text37 />
        <Container97 />
      </div>
    </div>
  );
}

function Container93() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f3f4f6] border-b-[0.735px] border-solid inset-0 pointer-events-none" />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[11px] pt-[10px] relative size-full -mx-[20px] px-[20px] w-[calc(100%+40px)] cursor-pointer text-left transition-colors duration-150 hover:bg-[#f8fafc]"
      >
        <Container94 />
        <Container95 />
        <Container96 />
      </button>
      {expanded && (
        <div className="pb-[12px] pr-[8px] pl-[44px] -mt-[2px]">
          <p className="text-[14px] leading-[20px] text-[#6b7280]">Drop-off after First Match rose to 14.6%. Matchmaking wait times on Android look like the likely cause — worth a closer look.</p>
        </div>
      )}
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[10.755px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="19.2049" preserveAspectRatio="none" viewBox="0 0 19.2049 19.2049" width="19.2049">
        <g id="Icon">
          <path d={svgPaths.p21e5bf00} id="Vector" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
          <path d={svgPaths.p25499700} id="Vector_2" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
        </g>
      </svg>
    </div>
  );
}

function Container99() {
  return (
    <div className="bg-[#fee2e2] relative rounded-[5.791px] shrink-0 size-[21.51px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon23 />
      </div>
    </div>
  );
}

function Container100() {
  return (
    <div className="relative shrink-0 flex-1 min-w-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[22px] not-italic relative text-[#374151] text-[16px] min-w-0 w-full">Voice Chat usage decreased</p>
      </div>
    </div>
  );
}

function Text38() {
  return (
    <div className="relative shrink-0 flex items-start w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#9ca3af] text-[16px] whitespace-nowrap relative shrink-0">6h ago</p>
    </div>
  );
}

function Container102() {
  return <div className="bg-[#ef4444] relative rounded-[3.309px] shrink-0 size-[6.618px]" data-name="Container" />;
}

function Container101() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text38 />
        <Container102 />
      </div>
    </div>
  );
}

function Container98() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f3f4f6] border-b-[0.735px] border-solid inset-0 pointer-events-none" />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[11px] pt-[10px] relative size-full -mx-[20px] px-[20px] w-[calc(100%+40px)] cursor-pointer text-left transition-colors duration-150 hover:bg-[#f8fafc]"
      >
        <Container99 />
        <Container100 />
        <Container101 />
      </button>
      {expanded && (
        <div className="pb-[12px] pr-[8px] pl-[44px] -mt-[2px]">
          <p className="text-[14px] leading-[20px] text-[#6b7280]">Voice Chat sessions fell 6% week-over-week, coinciding with the new mute-by-default setting shipped last release.</p>
        </div>
      )}
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[10.755px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="19.2049" preserveAspectRatio="none" viewBox="0 0 19.2049 19.2049" width="19.2049">
        <g id="Icon">
          <path d={svgPaths.p20f4dba0} id="Vector" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
          <path d={svgPaths.p288a1b00} id="Vector_2" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
        </g>
      </svg>
    </div>
  );
}

function Container104() {
  return (
    <div className="bg-[#ede9fe] relative rounded-[5.791px] shrink-0 size-[21.51px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon24 />
      </div>
    </div>
  );
}

function Container105() {
  return (
    <div className="flex-1 min-w-0 relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[22px] not-italic relative text-[#374151] text-[16px] min-w-0 w-full">New season launched</p>
      </div>
    </div>
  );
}

function Text39() {
  return (
    <div className="relative shrink-0 flex items-start w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#9ca3af] text-[16px] whitespace-nowrap relative shrink-0">1d ago</p>
    </div>
  );
}

function Container107() {
  return <div className="bg-[#7b6cf5] relative rounded-[3.309px] shrink-0 size-[6.618px]" data-name="Container" />;
}

function Container106() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text39 />
        <Container107 />
      </div>
    </div>
  );
}

function Container103() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div aria-hidden className="absolute border-[#f3f4f6] border-b-[0.735px] border-solid inset-0 pointer-events-none" />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[11px] pt-[10px] relative size-full -mx-[20px] px-[20px] w-[calc(100%+40px)] cursor-pointer text-left transition-colors duration-150 hover:bg-[#f8fafc]"
      >
        <Container104 />
        <Container105 />
        <Container106 />
      </button>
      {expanded && (
        <div className="pb-[12px] pr-[8px] pl-[44px] -mt-[2px]">
          <p className="text-[14px] leading-[20px] text-[#6b7280]">Season 12 is now live for all players. Early engagement is up 18% versus Season 11’s launch day.</p>
        </div>
      )}
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[10.755px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="19.2049" preserveAspectRatio="none" viewBox="0 0 19.2049 19.2049" width="19.2049">
        <g id="Icon">
          <path d={svgPaths.p20f4dba0} id="Vector" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
          <path d={svgPaths.p288a1b00} id="Vector_2" stroke="#7B6CF5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6004" />
        </g>
      </svg>
    </div>
  );
}

function Container109() {
  return (
    <div className="bg-[#ede9fe] relative rounded-[5.791px] shrink-0 size-[21.51px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative size-full">
        <Icon25 />
      </div>
    </div>
  );
}

function Container110() {
  return (
    <div className="flex-1 min-w-0 relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[22px] not-italic relative text-[#374151] text-[16px] min-w-0 w-full">New season launched</p>
      </div>
    </div>
  );
}

function Text40() {
  return (
    <div className="relative shrink-0 flex items-start w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[22px] not-italic text-[#9ca3af] text-[16px] whitespace-nowrap relative shrink-0">1d ago</p>
    </div>
  );
}

function Container112() {
  return <div className="bg-[#7b6cf5] relative rounded-[3.309px] shrink-0 size-[6.618px]" data-name="Container" />;
}

function Container111() {
  return (
    <div className="relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text40 />
        <Container112 />
      </div>
    </div>
  );
}

function Container108() {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center pb-[11px] pt-[10px] relative size-full -mx-[20px] px-[20px] w-[calc(100%+40px)] cursor-pointer text-left transition-colors duration-150 hover:bg-[#f8fafc]"
      >
        <Container109 />
        <Container110 />
        <Container111 />
      </button>
      {expanded && (
        <div className="pb-[12px] pr-[8px] pl-[44px] -mt-[2px]">
          <p className="text-[14px] leading-[20px] text-[#6b7280]">Season 12 rollout completed across all regions. No incidents reported during launch.</p>
        </div>
      )}
    </div>
  );
}

function Container87() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container88 />
        <Container93 />
        <Container98 />
        <Container103 />
        <Container108 />
      </div>
    </div>
  );
}

function Container83() {
  return (
    <div className="bg-white drop-shadow-[0px_1.655px_6.618px_rgba(0,0,0,0.06)] flex-[317.333_1_0] min-w-0 relative rounded-[13.237px] transition-shadow duration-200 hover:shadow-[0px_8px_20px_-4px_rgba(15,23,42,0.14)] cursor-default" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start gap-[14px] px-[20px] py-[16px] relative size-full">
        <Container84 />
        <Container87 />
      </div>
    </div>
  );
}

function DashboardBottom() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full" data-name="DashboardBottom">
      <Container60 />
      <Container69 />
      <Container83 />
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[36px] h-full min-h-0 min-w-0 flex-1 items-start overflow-y-auto overflow-x-hidden p-[44px] relative" data-name="Main Content Area">
      <HeaderSection />
      <SectionKpiRow />
      <MiddleSection />
      <DashboardBottom />
    </div>
  );
}

function DashbaordInner() {
  return (
    <div className="content-stretch flex items-stretch relative size-full h-screen overflow-hidden" style={{ backgroundImage: "linear-gradient(90deg, rgb(248, 249, 251) 0%, rgb(248, 249, 251) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }} data-name="Dashbaord">
      <AsideSidebar />
      <MainContentArea />
    </div>
  );
}

export default function Dashbaord() {
  const [range, setRange] = useState<RangeKey>("24h");
  const data = DATA_BY_RANGE[range];

  return (
    <DashboardDataContext.Provider value={{ range, setRange, data }}>
      <DashbaordInner />
    </DashboardDataContext.Provider>
  );
}