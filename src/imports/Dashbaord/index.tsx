import { createContext, useContext, useState } from "react";
import svgPaths from "./svg-j8ue68fght";
import imgImageAnthony from "./e80369b0bde9bc36bf18f9bf130673329ab18cff.png";
import { KpiCard } from "@/components/ui/KpiCard";
import { DateRangeSelector } from "@/components/ui/DateRangeSelector";
import { IconButton } from "@/components/ui/IconButton";
import { NotificationButton } from "@/components/ui/NotificationButton";
import { Settings, Search } from "lucide-react";
import { PopularScreensTable, type PopularScreenRow } from "@/components/ui/PopularScreensTable";
import { FeatureAdoptionTable, type FeatureAdoptionRow } from "@/components/ui/FeatureAdoptionTable";
import { AlertsNotificationsTable, type AlertRow } from "@/components/ui/AlertsNotificationsTable";
import { FunnelBar } from "@/components/ui/FunnelBar";
import { RevenueBarChart } from "@/components/ui/RevenueBarChart";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";

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
    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[21px] top-[calc(50%+0.398px)]" data-name="SVG">
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
    <div className="bg-[#623ec4] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[26px]" data-name="Background">
      <Svg />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 1">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[17px] whitespace-nowrap">
        <p className="leading-[19px]">Pulse</p>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[12px] whitespace-nowrap">
        <p className="leading-[16px]">Nova Arena</p>
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
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center p-[16px] relative size-full">
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
    <SidebarMenuItem>
      <SidebarMenuButton isActive data-name="Item → Link">
        <Svg1 />
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold not-italic whitespace-nowrap">Dashboard</p>
      </SidebarMenuButton>
    </SidebarMenuItem>
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
    <SidebarMenuItem>
      <SidebarMenuButton data-name="Item → Link">
        <Image9Vectorized />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal not-italic whitespace-nowrap">Retentions</p>
      </SidebarMenuButton>
    </SidebarMenuItem>
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
    <SidebarMenuItem>
      <SidebarMenuButton data-name="Item → Link">
        <Image3Vectorized />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal not-italic whitespace-nowrap">Players</p>
      </SidebarMenuButton>
    </SidebarMenuItem>
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
    <SidebarMenuItem>
      <SidebarMenuButton data-name="Item → Link">
        <Image4Vectorized />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal not-italic whitespace-nowrap">Features</p>
      </SidebarMenuButton>
    </SidebarMenuItem>
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
    <SidebarMenuItem>
      <SidebarMenuButton data-name="Item → Link">
        <Image5Vectorized />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal not-italic whitespace-nowrap">Revenue</p>
      </SidebarMenuButton>
    </SidebarMenuItem>
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
    <SidebarMenuItem>
      <SidebarMenuButton data-name="Item → Link">
        <Image6Vectorized />
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal not-italic whitespace-nowrap">{`Bugs & Issues`}</p>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function List() {
  return (
    <SidebarMenu className="gap-[6px]">
      <ItemLink />
      <ItemLink1 />
      <ItemLink2 />
      <ItemLink3 />
      <ItemLink4 />
      <ItemLink5 />
    </SidebarMenu>
  );
}

function Nav() {
  return (
    <SidebarGroup className="px-[11.162px]">
      <SidebarGroupContent>
        <List />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function NavMargin() {
  return (
    <SidebarContent className="bg-white pt-[11.162px]">
      <Nav />
    </SidebarContent>
  );
}

function ImageAnthony() {
  return (
    <div className="relative rounded-full shrink-0 size-[30px]" data-name="Image (Anthony)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-full size-full" src={imgImageAnthony} />
    </div>
  );
}

function Text() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[17px] not-italic relative shrink-0 text-[#111827] text-[13px] whitespace-nowrap">Rob Cohen</p>
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[15px] not-italic relative shrink-0 text-[#6b7280] text-[11px] whitespace-nowrap" dir="auto">
          Senior PM
        </p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex flex-col gap-[2px] items-start relative shrink-0" data-name="Container">
      <Text />
      <Text1 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
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
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center px-[12px] py-[8px] relative size-full">
        <ImageAnthony />
        <Container4 />
        <IconMargin />
      </div>
    </button>
  );
}

function AsideSidebar() {
  return (
    <SidebarProvider className="w-auto shrink-0 h-full" data-name="Aside - Sidebar">
      <Sidebar className="bg-[#fafafa] w-[224px] max-w-[224px] overflow-y-auto overflow-x-hidden">
        <SidebarHeader>
          <Container />
        </SidebarHeader>
        <NavMargin />
        <SidebarFooter className="border-t border-[#e5e7eb] pt-[8px]">
          <Frame2 />
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[22px] whitespace-nowrap">
        <p className="leading-[26px]">Dashboard</p>
      </div>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[#6b7280] text-[13px] whitespace-nowrap">
        <p className="leading-[17px]">{`Overview of your game's performance`}</p>
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

function Frame1() {
  const { range, setRange } = useDashboardData();
  return (
    <div className="content-stretch flex items-start justify-end px-[17.92px] relative shrink-0">
      <DateRangeSelector
        options={RANGE_OPTIONS.map((option) => ({ value: option.key, label: option.label }))}
        value={range}
        onValueChange={(next) => setRange(next as RangeKey)}
      />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-center gap-[8px] relative shrink-0">
      <IconButton icon={<Settings className="size-[24px]" />} aria-label="Settings" />
      <IconButton icon={<Search className="size-[24px]" />} aria-label="Search" />
      <NotificationButton count={3} />
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
    <div className="content-stretch flex flex-[1_0_0] flex-col h-[4.8px] items-start min-w-px relative" data-name="Container">
      <div className="relative shrink-0 size-[4.5px]" data-name="Icon">
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
    <div className="bg-[#fae07a] content-stretch flex gap-[4px] items-center px-[7px] py-[2px] relative rounded-[6px] shrink-0" data-name="Background">
      <Container12 />
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium not-italic relative shrink-0 text-[#2d2100] text-[11px] tracking-[0.094px] whitespace-nowrap">{data.retentionBadge}</p>
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
    <div className="content-stretch flex flex-col items-center relative shrink-0">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold h-[68px] justify-center leading-[0] not-italic relative shrink-0 text-[64px] text-white tracking-[-1px] w-[195px] text-center transition-opacity duration-200">
        <p className="leading-[normal]">{data.retention}</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-1 flex-col gap-[6px] items-center justify-center relative shrink-0 w-full">
      <Frame />
      <div className="[word-break:break-word] flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-white tracking-[-0.3px] text-center">
        <p className="leading-[normal]">Retention rate</p>
      </div>
    </div>
  );
}

function LargeHeroCard() {
  return (
    <div className="content-stretch flex flex-col min-h-[120px] items-start overflow-clip pb-[12px] pt-[12px] px-[14px] relative rounded-lg shadow-md flex-[5_1_0] min-w-0 transition-shadow duration-150 hover:shadow-lg cursor-default" style={{ backgroundImage: "linear-gradient(142.07828029689713deg, rgb(111, 75, 255) 0%, rgb(86, 41, 230) 100%)" }} data-name="Large Hero Card">
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
    <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(2,fit-content(100%))] gap-[12px] relative flex-[9_1_0] min-w-0" data-name="Container">
      <KpiCard
        title="Revenue"
        value={data.revenue}
        caption="Total revenue"
        sparklineData={REVENUE_TREND}
        className="col-1 row-1 self-stretch justify-self-stretch shrink-0"
      />
      <KpiCard
        title="DAU"
        value={data.dau}
        caption="Daily active users"
        sparklineData={DAU_TREND}
        className="col-2 row-1 self-stretch justify-self-stretch shrink-0"
      />
      <KpiCard
        title="Average Session"
        value={data.avgSession}
        caption="Average session duration"
        sparklineData={AVG_SESSION_TREND}
        className="col-1 row-2 self-stretch justify-self-stretch shrink-0"
      />
      <KpiCard
        title="Drop Off Rate"
        value={data.dropOff}
        caption="Players who leave"
        sparklineData={DROP_OFF_TREND}
        className="col-2 row-2 self-stretch justify-self-stretch shrink-0"
      />
    </div>
  );
}

function SectionKpiRow() {
  return (
    <div className="content-start flex flex-wrap gap-[12px] items-stretch relative shrink-0 w-full" data-name="Section - KPI Row">
      <LargeHeroCard />
      <Container13 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 3">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[14px] w-full">
        <p className="leading-[18px]">Player Funnel Performance</p>
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
    <div className="bg-[#f3f4f6] min-w-[30px] relative rounded-[8px] shrink-0 size-[30px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center min-w-[inherit] relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="min-w-[76px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap">Sign Up</p>
      </div>
    </div>
  );
}

function Container24() {
  const { data } = useDashboardData();
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container25 />
        <Container26 />
        <FunnelBar
          value={data.funnel[0].pct}
          gradientFrom="#7060ec"
          gradientTo="#9487f7"
          labelColor="#ffffff"
          stageName="Sign Up"
          className="flex-[202_0_0] h-full min-w-px"
        />
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
    <div className="bg-[#f3f4f6] min-w-[30px] relative rounded-[8px] shrink-0 size-[30px]" data-name="Container">
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
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap">Tutorial</p>
      </div>
    </div>
  );
}

function Container33() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap">Completed</p>
      </div>
    </div>
  );
}

function Container31() {
  return (
    <div className="min-w-[76px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <Container32 />
        <Container33 />
      </div>
    </div>
  );
}

function Container29() {
  const { data } = useDashboardData();
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container30 />
        <Container31 />
        <FunnelBar
          value={data.funnel[1].pct}
          gradientFrom="#7e6ff4"
          gradientTo="#a89cf9"
          labelColor="#ffffff"
          stageName="Tutorial Completed"
          className="flex-[202_0_0] h-full min-w-px"
        />
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
    <div className="bg-[#f3f4f6] min-w-[30px] relative rounded-[8px] shrink-0 size-[30px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center min-w-[inherit] relative size-full">
        <Icon5 />
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="min-w-[76px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap">First Match</p>
      </div>
    </div>
  );
}

function Container36() {
  const { data } = useDashboardData();
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container37 />
        <Container38 />
        <FunnelBar
          value={data.funnel[2].pct}
          gradientFrom="#9487f7"
          gradientTo="#bcb4fb"
          labelColor="#ffffff"
          stageName="First Match"
          className="flex-[202_0_0] h-full min-w-px"
        />
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
    <div className="bg-[#f3f4f6] min-w-[30px] relative rounded-[8px] shrink-0 size-[30px]" data-name="Container">
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
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap">Next Day</p>
      </div>
    </div>
  );
}

function Container45() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap">Return</p>
      </div>
    </div>
  );
}

function Container43() {
  return (
    <div className="min-w-[76px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <Container44 />
        <Container45 />
      </div>
    </div>
  );
}

function Container41() {
  const { data } = useDashboardData();
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container42 />
        <Container43 />
        <FunnelBar
          value={data.funnel[3].pct}
          gradientFrom="#bcb4fb"
          gradientTo="#d4cffd"
          labelColor="#7060ec"
          stageName="Next Day Return"
          className="flex-[202_0_0] h-full min-w-px"
        />
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
    <div className="bg-[#f3f4f6] min-w-[30px] relative rounded-[8px] shrink-0 size-[30px]" data-name="Container">
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
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap">First</p>
      </div>
    </div>
  );
}

function Container52() {
  return (
    <div className="relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <p className="[word-break:break-word] font-['Inter:Regular',sans-serif] font-normal leading-[16px] not-italic relative shrink-0 text-[#1e293b] text-[13px] whitespace-nowrap">Purchase</p>
      </div>
    </div>
  );
}

function Container50() {
  return (
    <div className="min-w-[76px] relative shrink-0 w-[76px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start min-w-[inherit] relative size-full">
        <Container51 />
        <Container52 />
      </div>
    </div>
  );
}

function Container48() {
  const { data } = useDashboardData();
  return (
    <div className="h-[36px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Container49 />
        <Container50 />
        <FunnelBar
          value={data.funnel[4].pct}
          gradientFrom="#f5c53a"
          gradientTo="#f8d96b"
          labelColor="#8b6200"
          stageName="First Purchase"
          className="flex-[202_0_0] h-full min-w-px"
        />
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
    <div className="bg-white border border-[#eef0f5] shadow-sm content-stretch flex flex-col gap-[14px] items-start px-[16px] py-[16px] relative rounded-lg flex-[3_1_0] min-w-0" data-name="Player Funnel Performance">
      <Heading2 />
      <ContainerMargin />
    </div>
  );
}

function Text15() {
  const { data } = useDashboardData();
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic text-[#7b6cf5] text-[12px] whitespace-nowrap relative shrink-0 transition-opacity duration-200">{data.revenueBars[0].value}</p>
    </div>
  );
}

function Icon8() {
  const { data } = useDashboardData();
  const maxValue = Math.max(...data.revenueBars.map((b) => b.height));
  return (
    <div className="group/revbar relative shrink-0 w-[36px] h-full transition-[height] duration-300 ease-out cursor-default" data-name="Icon">
      <RevenueBarChart
        value={data.revenueBars[0].height}
        maxValue={maxValue}
        gradientFrom="#7060ec"
        gradientTo="#9487f7"
        className="transition-[filter] duration-150 group-hover/revbar:brightness-110"
      />
      <div className="pointer-events-none absolute -top-[36px] left-1/2 -translate-x-1/2 opacity-0 group-hover/revbar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        Battle Pass: {data.revenueBars[0].value}
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic text-[#1e293b] text-[11px] text-center w-full">Battle Pass</p>
    </div>
  );
}

function Container55() {
  return (
    <div className="relative shrink-0 h-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid flex flex-col gap-[4px] items-center h-full w-full">
        <Text15 />
        <div className="flex-1 min-h-0 w-full flex items-end justify-center">
          <Icon8 />
        </div>
        <Text16 />
      </div>
    </div>
  );
}

function Text17() {
  const { data } = useDashboardData();
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic text-[#7b6cf5] text-[12px] whitespace-nowrap relative shrink-0 transition-opacity duration-200">{data.revenueBars[1].value}</p>
    </div>
  );
}

function Icon9() {
  const { data } = useDashboardData();
  const maxValue = Math.max(...data.revenueBars.map((b) => b.height));
  return (
    <div className="group/revbar relative shrink-0 w-[36px] h-full transition-[height] duration-300 ease-out cursor-default" data-name="Icon">
      <RevenueBarChart
        value={data.revenueBars[1].height}
        maxValue={maxValue}
        gradientFrom="#7e6ff4"
        gradientTo="#a89cf9"
        className="transition-[filter] duration-150 group-hover/revbar:brightness-110"
      />
      <div className="pointer-events-none absolute -top-[36px] left-1/2 -translate-x-1/2 opacity-0 group-hover/revbar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        Bundles: {data.revenueBars[1].value}
      </div>
    </div>
  );
}

function Text18() {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic text-[#1e293b] text-[11px] text-center w-full">Bundles</p>
    </div>
  );
}

function Container56() {
  return (
    <div className="relative shrink-0 h-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid flex flex-col gap-[4px] items-center h-full w-full">
        <Text17 />
        <div className="flex-1 min-h-0 w-full flex items-end justify-center">
          <Icon9 />
        </div>
        <Text18 />
      </div>
    </div>
  );
}

function Text19() {
  const { data } = useDashboardData();
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic text-[#8575f6] text-[12px] whitespace-nowrap relative shrink-0 transition-opacity duration-200">{data.revenueBars[2].value}</p>
    </div>
  );
}

function Icon10() {
  const { data } = useDashboardData();
  const maxValue = Math.max(...data.revenueBars.map((b) => b.height));
  return (
    <div className="group/revbar relative shrink-0 w-[36px] h-full transition-[height] duration-300 ease-out cursor-default" data-name="Icon">
      <RevenueBarChart
        value={data.revenueBars[2].height}
        maxValue={maxValue}
        gradientFrom="#9487f7"
        gradientTo="#bcb4fb"
        className="transition-[filter] duration-150 group-hover/revbar:brightness-110"
      />
      <div className="pointer-events-none absolute -top-[36px] left-1/2 -translate-x-1/2 opacity-0 group-hover/revbar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        Skins: {data.revenueBars[2].value}
      </div>
    </div>
  );
}

function Text20() {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic text-[#1e293b] text-[11px] text-center w-full">Skins</p>
    </div>
  );
}

function Container57() {
  return (
    <div className="relative shrink-0 h-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid flex flex-col gap-[4px] items-center h-full w-full">
        <Text19 />
        <div className="flex-1 min-h-0 w-full flex items-end justify-center">
          <Icon10 />
        </div>
        <Text20 />
      </div>
    </div>
  );
}

function Text21() {
  const { data } = useDashboardData();
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic text-[#7b6cf5] text-[12px] whitespace-nowrap relative shrink-0 transition-opacity duration-200">{data.revenueBars[3].value}</p>
    </div>
  );
}

function Icon11() {
  const { data } = useDashboardData();
  const maxValue = Math.max(...data.revenueBars.map((b) => b.height));
  return (
    <div className="group/revbar relative shrink-0 w-[36px] h-full transition-[height] duration-300 ease-out cursor-default" data-name="Icon">
      <RevenueBarChart
        value={data.revenueBars[3].height}
        maxValue={maxValue}
        gradientFrom="#bcb4fb"
        gradientTo="#d4cffd"
        className="transition-[filter] duration-150 group-hover/revbar:brightness-110"
      />
      <div className="pointer-events-none absolute -top-[36px] left-1/2 -translate-x-1/2 opacity-0 group-hover/revbar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        Season Pass: {data.revenueBars[3].value}
      </div>
    </div>
  );
}

function Text22() {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic text-[#1e293b] text-[11px] text-center w-full">Season Pass</p>
    </div>
  );
}

function Container58() {
  return (
    <div className="relative shrink-0 h-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid flex flex-col gap-[4px] items-center h-full w-full">
        <Text21 />
        <div className="flex-1 min-h-0 w-full flex items-end justify-center">
          <Icon11 />
        </div>
        <Text22 />
      </div>
    </div>
  );
}

function Text23() {
  const { data } = useDashboardData();
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Bold',sans-serif] font-bold leading-[15px] not-italic text-[#8b6200] text-[12px] whitespace-nowrap relative shrink-0 transition-opacity duration-200">{data.revenueBars[4].value}</p>
    </div>
  );
}

function Icon12() {
  const { data } = useDashboardData();
  const maxValue = Math.max(...data.revenueBars.map((b) => b.height));
  return (
    <div className="group/revbar relative shrink-0 w-[36px] h-full transition-[height] duration-300 ease-out cursor-default" data-name="Icon">
      <RevenueBarChart
        value={data.revenueBars[4].height}
        maxValue={maxValue}
        gradientFrom="#f5c53a"
        gradientTo="#f8d96b"
        className="transition-[filter] duration-150 group-hover/revbar:brightness-110"
      />
      <div className="pointer-events-none absolute -top-[36px] left-1/2 -translate-x-1/2 opacity-0 group-hover/revbar:opacity-100 transition-opacity duration-150 bg-[#1e293b] text-white text-[13px] font-medium rounded-[6px] px-[8px] py-[4px] whitespace-nowrap shadow-[0px_4px_12px_rgba(0,0,0,0.15)] z-10">
        Coins: {data.revenueBars[4].value}
      </div>
    </div>
  );
}

function Text24() {
  return (
    <div className="relative shrink-0 flex items-center justify-center w-full" data-name="Text">
      <p className="[word-break:break-word] font-['Inter:Medium',sans-serif] font-medium leading-[14px] not-italic text-[#1e293b] text-[11px] text-center w-full">Coins</p>
    </div>
  );
}

function Container59() {
  return (
    <div className="relative shrink-0 h-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid flex flex-col gap-[4px] items-center h-full w-full">
        <Text23 />
        <div className="flex-1 min-h-0 w-full flex items-end justify-center">
          <Icon12 />
        </div>
        <Text24 />
      </div>
    </div>
  );
}

function FlatBarChart() {
  return (
    <div className="flex flex-1 justify-start gap-[20px] relative shrink-0 w-full items-stretch" data-name="FlatBarChart">
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
    <div className="bg-white border border-[#eef0f5] shadow-sm content-stretch flex flex-col gap-[14px] items-start px-[16px] py-[16px] relative rounded-lg flex-[4_1_0] min-w-0" data-name="Revenue Breakdown">
      <div className="[word-break:break-word] flex flex-col font-['Inter:Semi_Bold',sans-serif] font-semibold justify-center leading-[0] not-italic relative shrink-0 text-[#1e293b] text-[14px] w-full">
        <p className="leading-[18px]">Revenue Breakdown</p>
      </div>
      <FlatBarChart />
    </div>
  );
}

function MiddleSection() {
  return (
    <div className="content-stretch flex gap-[16px] items-stretch relative shrink-0 w-full" data-name="Middle Section">
      <PlayerFunnelPerformance />
      <RevenueBreakdown />
      <RevenueBreakdown />
    </div>
  );
}

const POPULAR_SCREENS_ROWS: PopularScreenRow[] = [
  { screen: "Battle Pass", views: "45.2K", avgTime: "2m 01s", exitRate: "45.2%", indicatorColor: "purple" },
  { screen: "Store", views: "38.1K", avgTime: "2m 01s", exitRate: "38.1%", indicatorColor: "purple" },
  { screen: "Profile", views: "22.4K", avgTime: "2m 01s", exitRate: "22.4%", indicatorColor: "purple" },
  { screen: "Lobby", views: "18.3K", avgTime: "2m 01s", exitRate: "18.3%", indicatorColor: "yellow" },
  { screen: "Home", views: "18.3K", avgTime: "2m 01s", exitRate: "18.3%", indicatorColor: "yellow" },
];

const FEATURE_ADOPTION_ROWS: FeatureAdoptionRow[] = [
  { feature: "Daily Challenges", users: "45.2K", adoption: "85%", trend: "up" },
  { feature: "Battle Pass", users: "38.1K", adoption: "12%", trend: "up" },
  { feature: "Ranked Mode", users: "22.4K", adoption: "43%", trend: "up" },
  { feature: "Voice Chat", users: "18.3K", adoption: "88%", trend: "flat" },
  { feature: "Clan System", users: "18.3K", adoption: "44%", trend: "down" },
];

const ALERT_ROWS: AlertRow[] = [
  {
    id: "retention-improved",
    message: "Retention improved",
    timestamp: "2h ago",
    type: "positive",
    detail:
      "Day-7 retention rose to 45.2%, up from 41.8% last period. Biggest gains came from the Tutorial \u2192 First Match step.",
  },
  {
    id: "drop-off-increased",
    message: "Drop Off increased",
    timestamp: "4h ago",
    type: "warning",
    detail:
      "Drop-off after First Match rose to 14.6%. Matchmaking wait times on Android look like the likely cause \u2014 worth a closer look.",
  },
  {
    id: "voice-chat-decreased",
    message: "Voice Chat usage decreased",
    timestamp: "6h ago",
    type: "negative",
    detail:
      "Voice Chat sessions fell 6% week-over-week, coinciding with the new mute-by-default setting shipped last release.",
  },
  {
    id: "season-launched-1",
    message: "New season launched",
    timestamp: "1d ago",
    type: "positive",
    detail: "Season 12 is now live for all players. Early engagement is up 18% versus Season 11\u2019s launch day.",
  },
  {
    id: "season-launched-2",
    message: "New season launched",
    timestamp: "1d ago",
    type: "positive",
    detail: "Season 12 rollout completed across all regions. No incidents reported during launch.",
  },
];

function DashboardBottom() {
  return (
    <div className="content-stretch flex gap-[16px] items-stretch relative shrink-0 w-full" data-name="DashboardBottom">
      <PopularScreensTable rows={POPULAR_SCREENS_ROWS} />
      <FeatureAdoptionTable rows={FEATURE_ADOPTION_ROWS} />
      <AlertsNotificationsTable alerts={ALERT_ROWS} />
    </div>
  );
}

function MainContentArea() {
  return (
    <div className="bg-white h-full min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden relative" data-name="Main Content Area">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-[24px] items-start px-[28px] py-[28px]">
        <HeaderSection />
        <SectionKpiRow />
        <MiddleSection />
        <DashboardBottom />
      </div>
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