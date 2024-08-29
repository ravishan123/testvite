import { useEffect, useState } from "react";
import { IconChevronsLeft, IconMenu2, IconX } from "@tabler/icons-react";
import { Layout } from "./custom/layout";
import { Button } from "./custom/button";
import Nav from "./nav";
import { cn } from "@/lib/utils";
import { sidelinks } from "@/data/sidelinks";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false);

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [navOpened]);

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? "md:w-14" : "md:w-64"}`,
        className,
      )}
    >
      {/* Overlay in mobile */}
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? "h-svh opacity-50" : "h-0 opacity-0"} w-full bg-black md:hidden`}
      />

      <Layout fixed className={navOpened ? "h-svh" : ""}>
        {/* Header */}
        <Layout.Header
          sticky
          className="z-50 flex justify-between px-4 py-3 shadow-sm md:px-4"
        >
          <div className={`flex items-center ${!isCollapsed ? "gap-2" : ""}`}>
            <div className="p-3 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="60"
                viewBox="0 0 85 124"
                fill="none"
              >
                <path
                  d="M84.3854 90.8569C84.1454 91.3057 83.8659 91.7256 83.6147 92.1511C81.3623 96.1741 78.9598 99.9401 76.0638 103.412C73.1661 106.87 69.7986 110.045 65.7451 112.52C62.8401 114.119 59.7927 115.867 56.5258 117.164C53.2921 118.498 49.9111 119.585 46.6418 119.979C50.5209 119.625 54.4044 118.634 58.0553 117.042C61.7198 115.472 65.1968 113.41 68.4265 110.99C71.6568 108.563 74.5862 105.728 77.297 102.669C78.6797 101.16 79.909 99.5066 81.1715 97.8666L82.9365 95.3133C83.5373 94.4588 84.0364 93.5438 84.5999 92.6565C84.6445 93.6134 84.6327 94.658 84.4418 95.7191C84.2154 96.7558 83.8462 97.8287 83.2866 98.8954C80.1941 103.742 76.5296 107.913 72.4761 111.442C72.2412 111.153 71.7799 110.59 71.5467 110.307C68.9957 113.064 66.0009 115.241 62.8593 117.019C59.6662 118.725 56.2937 119.965 52.8494 120.812C51.9816 121.015 51.0968 121.152 50.2289 121.325L48.919 121.57L47.5876 121.713C46.7022 121.804 45.8225 121.933 44.9332 121.989C44.0417 122.024 43.1479 122.056 42.2512 122.087C38.6325 122.206 35.0905 121.883 31.4865 121.532C31.9461 121.849 31.5875 122.081 31.434 122.298C34.9516 123.011 38.5303 123.459 42.2015 123.345C43.1117 123.301 44.0123 123.254 44.9169 123.216C45.8225 123.161 46.7022 122.992 47.5955 122.888L48.9252 122.705C49.3769 122.641 49.806 122.52 50.2448 122.432L52.8658 121.843C56.2937 120.849 59.6544 119.601 62.8519 117.914C63.6706 117.535 64.4227 117.034 65.2172 116.582C66.0009 116.129 66.797 115.679 67.5435 115.139C68.2973 114.619 69.0601 114.099 69.8189 113.576C70.5451 112.997 71.2712 112.415 72.0046 111.831C67.5711 115.603 62.6582 118.641 57.3654 120.767C56.7172 121.065 56.0396 121.285 55.357 121.507L53.3198 122.183C51.9562 122.584 50.5485 122.882 49.1567 123.216C47.7372 123.419 46.329 123.683 44.8937 123.807L42.734 123.93C42.0158 123.97 41.2993 124.008 40.5635 123.981C34.7518 123.871 29.3104 122.645 24.0435 120.655C21.4134 119.66 18.8404 118.436 16.3328 116.961C13.8258 115.491 11.3781 113.773 9.05468 111.704C6.46018 109.397 4.53195 106.526 2.89903 103.483C1.98658 101.785 -0.84167 97.2385 1.23618 95.8249C2.30617 95.1023 3.61159 94.2953 4.65222 95.4825C5.20499 96.1146 5.66179 98.3969 6.58553 98.501C8.27774 98.69 7.34383 94.2223 7.56856 93.3769C7.90564 92.1127 8.61991 91.2372 9.32965 90.7919C9.69949 90.5253 10.0851 90.3731 10.4826 90.3431C10.6814 90.3233 10.8841 90.3539 11.0811 90.3793C11.2805 90.3963 11.4792 90.4371 11.6785 90.4902C12.4662 90.7341 13.1686 91.2525 13.9309 92.0957C14.7304 93.0775 15.5824 94.1504 16.5886 95.3275C17.5914 96.4893 18.7517 97.7427 20.13 98.9418C22.8498 101.356 26.3923 103.57 30.1127 104.568C32.7767 105.38 35.5084 105.906 38.113 106.188C39.4275 106.326 40.6731 106.439 41.9181 106.45C42.5505 106.443 43.1812 106.462 43.8249 106.501C44.4635 106.483 45.0992 106.45 45.7604 106.46C45.9801 106.462 46.2076 106.474 46.4335 106.469L47.1116 106.391L48.4921 106.241C49.408 106.108 50.3232 105.823 51.2588 105.617C52.1679 105.304 53.0962 104.999 54.0103 104.626L55.357 104C55.8115 103.798 56.2711 103.591 56.7008 103.331C60.2473 101.422 63.5363 98.9 66.6542 96.2527C67.234 95.7711 67.7196 95.0281 68.2526 94.2591C68.8043 93.5104 69.2351 92.6163 69.6896 91.811C70.1764 91.0103 70.5281 90.2073 70.9268 89.5826C71.3243 88.955 71.7257 88.4892 72.0939 88.2629C72.9798 87.5091 73.6974 87.7808 74.3959 88.3161C73.3575 90.7143 71.9781 92.9513 70.5247 95.0825C69.7252 96.1005 69.003 97.1712 68.1177 98.1021C67.6874 98.5785 67.2702 99.0635 66.8354 99.5332L65.4611 100.845C63.1043 102.849 60.5838 104.632 57.8741 105.917C55.1751 107.217 52.3576 108.135 49.5339 108.595C52.3379 108.294 55.1667 107.44 57.8843 106.136C60.6081 104.822 63.1359 102.974 65.4611 100.845L66.8806 99.5864C67.3317 99.141 67.7654 98.6691 68.208 98.2215C69.134 97.3302 69.8997 96.298 70.7438 95.3201C72.2932 93.2722 73.7832 91.1167 74.9509 88.7711C75.5353 89.2685 76.1434 89.7914 76.9147 89.7948C76.9147 89.7948 77.0863 89.4015 77.3003 88.9052C77.4065 88.6618 77.5285 88.3891 77.6295 88.1214C77.7233 87.8526 77.8091 87.6031 77.8774 87.3943C79.2647 86.0978 80.5142 85.7707 81.5323 86.1074C82.5514 86.4436 83.3425 87.4706 83.862 88.7467C84.0291 89.3624 84.2278 90.0687 84.3854 90.8569Z"
                  fill="#374EA9"
                  className="fill:#374EA9;fill:color(display-p3 0.2157 0.3059 0.6627);fill-opacity:1;"
                />
                <path
                  d="M75.9059 59.5361C75.9059 54.5093 71.8354 50.432 66.8192 50.432C61.8013 50.432 57.7354 54.5093 57.7354 59.5361C57.7354 64.5686 61.8013 68.6436 66.8192 68.6436C71.8354 68.6436 75.9059 64.5686 75.9059 59.5361Z"
                  fill="#374EA9"
                  className="fill:#374EA9;fill:color(display-p3 0.2157 0.3059 0.6627);fill-opacity:1;"
                />
                <path
                  d="M48.2669 9.43335C48.2669 -1.96654 30.7989 -2.13858 30.7989 9.25962C30.7989 15.0911 30.7283 74.675 30.7283 77.8842C30.7283 89.283 48.1964 89.4567 48.1964 78.0568C48.1964 72.1093 48.2669 12.6046 48.2669 9.43335Z"
                  fill="#374EA9"
                  className="fill:#374EA9;fill:color(display-p3 0.2157 0.3059 0.6627);fill-opacity:1;"
                />
              </svg>
            </div>
           
            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? "invisible w-0" : "visible w-auto"}`}
            >
              <span className="font-medium ">Gudppl</span>
              <span className="text-xs">Back-Office</span>
            </div>
          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </Layout.Header>

        {/* Navigation links */}
        <Nav
          id="sidebar-menu"
          className={`z-40 h-full flex-1 overflow-auto ${navOpened ? "max-h-screen" : "max-h-0 py-0 md:max-h-screen md:py-2"}`}
          closeNav={() => setNavOpened(false)}
          isCollapsed={isCollapsed}
          links={sidelinks}
        />

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex"
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </Button>
      </Layout>
    </aside>
  );
}
