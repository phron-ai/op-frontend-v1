//@ts-nocheck
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import useContracts from "smartcontract-builder/hooks/contracts";
// import { ContractContext } from "smartcontract-builder/context";
import useWorkflow from "smartcontract-builder/hooks/workflow";
import useQuestions from "AImarketplace/hooks/useQuestions";
import useOracles from "AImarketplace/hooks/useOracles";
import useCost from "smartcontract-builder/hooks/cost";
import useAuth from "smartcontract-builder/hooks/auth";
import ContributeSideBar from "./contributeSidebar";
import ContractSidebar from "./contractSidebar";
import { saveAddress } from "utils/useSigner";
import { navItems, navItemsDesktop } from "constants/navItems";
// import { Label } from "components/ui/label";
import { Logo } from "components/ui/logo";
import useTimer from "utils/useTimer";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { ContractContext } from "../../../smartcontract-builder/context";
// import Modal from "../../../smartcontract-builder/components/modal";
const titles = {
  "/dashboard": "Dashboard",
  "/oracle": "AI Agents",
  "/contribute": "Contribute",
  "/agent": "My Contracts",
  "/subscriptions": "Subscriptions",
  "/admin": "Admin Dashboard",
};

export default function DashboardLayout({
  children,
  title = "Dashboard",
}: {
  title?: string;
  children: React.ReactNode;
}) {
  const navigator = useNavigate();

  const { state, update } = useContext(ContractContext) as ContractContextValue;
  const { updateOracles, updateSomeOracle } = useOracles();
  const { isLoading, updateContracts } = useContracts();
  const { updateQuestions } = useQuestions();
  const { updateWorkflow } = useWorkflow();
  const { pathname } = useLocation();
  const { getSignature } = useAuth();
  const { address } = useAccount();
  const { getToken } = useCost();
  const { timer } = useTimer(30);
  const { isAuth } = useAuth();

  const mainRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Overview");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getSignature();

    if (address) getToken();

    if (!isLoading && !isAuth) navigator("/");
  }, [isAuth, address]);

  useEffect(() => {
    saveAddress(address);
    if (!isAuth) return;
    updateContracts();
    updateOracles();
    updateSomeOracle();
    updateQuestions();
    updateWorkflow();
  }, [isAuth, timer, address]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  useEffect(() => {
    const chatInputContainer = document.getElementById("chat-input-container");

    if (chatInputContainer) {
      if (isMobile) {
        chatInputContainer.style.left = isMobileMenuOpen ? "0px" : "0px";
      } else {
        chatInputContainer.style.left = isExpanded ? "240px" : "80px";
      }
    }
  }, [isMobile, isMobileMenuOpen, isExpanded]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const chatInputContainer = document.getElementById(
        "chat-input-container"
      );

      if (chatInputContainer) {
        if (isMobile) {
          chatInputContainer.style.left = isMobileMenuOpen ? "0px" : "0px";
        } else {
          chatInputContainer.style.left = isExpanded ? "240px" : "80px";
        }
        observer.disconnect(); // Stop observing once found
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, [isMobile, isMobileMenuOpen, isExpanded]);

  // Toggle button
  const toggleSidebar = () => {
    if (!isMobile) {
      // Desktop -> toggle isExpanded
      setIsExpanded((prev) => !prev);
    } else {
      // Mobile -> toggle isMobileMenuOpen
      setIsMobileMenuOpen((prev) => !prev);
    }
  };

  // Check if user is admin
  const isAdmin = useMemo(() => {
    if (!address) return false;
    const adminAddresses =
      process.env.REACT_APP_ADMIN_ADDRESSES?.split(",") || [];
    return adminAddresses.includes(address.toLowerCase());
  }, [address]);

  // Filter nav items based on admin status
  const filteredNavItems = useMemo(() => {
    return navItems.filter(
      (item) => !item.adminOnly || (item.adminOnly && isAdmin)
    );
  }, [isAdmin]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  const renderedItems = useMemo(() => {
    return filteredNavItems.map((item) => (
      <Link key={item.id} to={item.href}>
        <motion.div
          className={`flex items-center space-x-3 mx-3 my-1 px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
            isExpanded || isMobile ? "" : "justify-center"
          } ${
            pathname === item.href
              ? "bg-primary text-[#efefff]"
              : "text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-[#efefff] dark:hover:bg-gray-700"
          }`}
          onClick={() => {
            setActiveLink(item.label);
            if (isMobile) setIsMobileMenuOpen(false);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex-shrink-0">
            <item.icon
              size={18}
              className={pathname === item.href ? "text-[#efefff]" : ""}
            />
          </span>
          {(isExpanded || isMobile) && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap"
            >
              {item.label}
            </motion.span>
          )}
        </motion.div>
      </Link>
    ));
  }, [pathname, isExpanded, isMobile, activeLink, filteredNavItems]);
  // const [connect, setConnect] = useState(true);
  // const handleDesktopLinks = () => {
  //   if (!address) {
  //   }
  // };
  const DesktopContent = (
    <>
      {/* <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0.8 }}
        animate={{
          opacity: [0.8, 0.9, 0.8],
          background: [
            `radial-gradient(circle at ${mousePosition.x * 100}% ${
              mousePosition.y * 100
            }%, #cecee2 0%, #efefff 70%)`,
            `radial-gradient(circle at ${mousePosition.x * 100}% ${
              mousePosition.y * 100
            }%, #cecee2 0%, #efefff 70%)`,
          ],
        }}
        transition={{
          opacity: {
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
          background: {
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          },
        }}
      /> */}
      {/* <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div> */}
      <div className={`flex items-center justify-between z-[1] `}>
        <div>
          <Logo />
        </div>
      </div>
      <nav id="sidebar" className="hidden lg:flex ml-4 z-[1]">
        {pathname === "/" ? (
          <>
            {navItemsDesktop.map((item) => (
              <ul
                key={item.id}
                className="whitespace-nowrap hover:underline font-semibold text-sm"
              >
                <Link to={item.href}>
                  <li className="mx-3">{item.label}</li>
                </Link>
              </ul>
            ))}
          </>
        ) : null}
      </nav>
    </>
  );
  const sidebarContent = (
    <>
      <div
        className={`flex items-center justify-between p-4 ${
          isExpanded ? "flex-row" : "flex-col"
        } `}
      >
        {isExpanded ? (
          <div className="max-w-[150px]">
            <Logo />
          </div>
        ) : isMobile ? (
          <div className="max-w-[180px]">
            <Logo />
          </div>
        ) : (
          <div className="max-w-[50px] w-full">
            <Logo showOnlyHead />
          </div>
        )}

        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0 transition-colors duration-200"
          >
            {isExpanded ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        )}
      </div>
      <nav id="sidebar" className="flex-1 py-4">
        {renderedItems}
        {isExpanded === true && pathname === "/agent" ? (
          <>
            <hr />
            <ContractSidebar />
          </>
        ) : null}
        {isExpanded === true &&
        (pathname === "/contribute" || pathname === "/apikey") ? (
          <>
            <hr />
            <ContributeSideBar />
          </>
        ) : null}
      </nav>
    </>
  );

  const titleKey = useMemo(() => {
    return Object.keys(titles).find((key) => {
      if (pathname === "/") {
        return "/";
      }

      return key.length > 2 && pathname.includes(key);
    });
  }, [pathname]);

  return (
    <div
      className={`flex ${
        pathname !== "/" ? "bg-white" : "bg-[#e5e5ff]"
      } h-screen ${isDarkMode ? "dark" : ""}`}
    >
      {!isMobile && pathname !== "/" && (
        <motion.nav
          className="white fixed h-screen dark:bg-gray-800 text-gray-800 dark:text-white dark:border-gray-700 flex flex-col"
          initial={{ width: isExpanded ? 240 : 80 }}
          animate={{ width: isExpanded ? 240 : 80 }}
          transition={{ duration: 0.3 }}
        >
          {sidebarContent}
        </motion.nav>
      )}
      <main
        ref={mainRef}
        className={`transition ease-in-out bg-[#e5e5ff]   
          ${
            pathname !== "/" && !isMobile && isExpanded
              ? "ml-[240px]"
              : isExpanded === false
              ? "ml-[80px]"
              : "ml-[0px]"
          }
          flex-1  dark:bg-gray-900 overflow-x-hidden`}
      >
        <div
          className={`bg-white sticky z-10 top-0  ${
            pathname !== "/" ? "xl:pt-2" : ""
          }`}
        >
          <div
            className={`sticky ${
              pathname !== "/" ? "borderbottomheader" : ""
            } top-0 lg:top-2 z-10 bg-[#e5e5ff] dark:bg-gray-900 p-4 md:py-4 md:px-8 ${
              pathname !== "/" ? " xl:rounded-tl-[20px]" : ""
            } flex flex-col sm:flex-row justify-between  sm:items-start xl:items-center`}
          >
            <div className="flex w-full max-w-[400px] gap-6 items-center ">
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 z-[1]"
                >
                  <Menu
                    size={24}
                    className="text-gray-600 dark:text-gray-400 "
                  />
                </button>
              )}

              {pathname === "/" ? (
                DesktopContent
              ) : (
                <h2 className="text-base text-primary font-light uppercase tracking-[10px] dark:text-white">
                  {titles[titleKey]}
                </h2>
              )}
            </div>
            <div className="flex flex-row xl:flex-row gap-2 md:gap-4 items-end w-full justify-end space-x-4 whitespace-nowrap z-[1]">
              {/* {address ? (
                <div className="w-full max-w-[180px]">
                  <Label className="font-bold hidden xl:block">
                    Select Chat Mode
                  </Label>
                  <Select
                    value={state.chatMode}
                    onValueChange={(v) => {
                      update({ chatMode: v, isUserSelectedChatMode: true });
                    }}
                  >
                    <SelectTrigger className="mt-1 bg-white rounded-xl">
                      <SelectValue placeholder="Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Basic</SelectItem>
                      <SelectItem value="3">Advance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : null} */}
              <ConnectButton />
            </div>
          </div>
        </div>
        <div
          className={`${
            pathname === "/dashboard"
              ? "h-[80vh] flex items-center justify-center"
              : ""
          } px-4 bg-[#e5e5ff] ${pathname !== "/" ? "lg:pr-4 " : ""}   pb-4 `}
        >
          {children}
        </div>
        {/* <Modal isOpen={connect} onClose={() => setConnect(false)}></Modal> */}
      </main>
      {/* <AnimatePresence> */}
      {isMobile && isMobileMenuOpen && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-r border-gray-200 dark:border-gray-700 flex flex-col z-[51]"
        >
          {sidebarContent}
        </motion.div>
      )}
      {/* </AnimatePresence> */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[50]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
