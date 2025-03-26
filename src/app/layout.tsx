"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "@/redux/features/authSlice";
import { fetchCart } from "@/redux/features/cartSlice";
import { Inter } from "next/font/google";
import RootLayout from "@/components/layout/RootLayout";
import { Providers } from "./providers";
import "./globals.css";
import type { Metadata } from "next";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const metadata = {
  title: "Favorit116",
  description: "Ваш надежный магазин автомобильных шин и аксессуаров",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={inter.className}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body>
        <Providers>
          <RootLayout>
            <AppContent>{children}</AppContent>
          </RootLayout>
        </Providers>
      </body>
    </html>
  );
}

function AppContent({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        if (isInitialized) {
          return;
        }

        const isAuthPage = pathname === "/login" || pathname === "/register";
        if (isAuthPage) {
          setIsInitialized(true);
          return;
        }

        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        if (accessToken) {
          try {
            await dispatch(getMe() as any);
            await dispatch(fetchCart() as any);
          } catch (error) {

            if (refreshToken) {
              try {

                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/token/refresh/`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh: refreshToken }),
                  },
                );

                if (response.ok) {
                  const data = await response.json();
                  localStorage.setItem("access_token", data.access);

                  await dispatch(getMe() as any);
                  await dispatch(fetchCart() as any);
                } else {

                  const isProtectedPage =
                    pathname?.startsWith("/admin") ||
                    pathname?.startsWith("/profile");

                  if (!isProtectedPage) {
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                  }
                }
              } catch (refreshError) {
                const isProtectedPage =
                  pathname?.startsWith("/admin") ||
                  pathname?.startsWith("/profile");

                if (!isProtectedPage) {
                  localStorage.removeItem("access_token");
                  localStorage.removeItem("refresh_token");
                }
              }
            }
          }
        }

        setIsInitialized(true);
      } catch (error) {
        setIsInitialized(true);
      }
    };

    initApp();
  }, [dispatch, pathname, isInitialized]);

  return <>{children}</>;
}
