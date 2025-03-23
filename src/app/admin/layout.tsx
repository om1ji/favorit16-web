"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  getMe,
} from "@/redux/features/authSlice";
import { AppDispatch } from "@/redux/store";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import { authAPI } from "@/services/api";
import "./admin.scss";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [redirectInProgress, setRedirectInProgress] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const userData = await authAPI.getMe();

        if (!userData.is_admin && !userData.is_staff) {
          router.push("/");
        }
      } catch (error) {
        console.error("Ошибка авторизации:", error);
        router.push("/login?redirect=" + encodeURIComponent(pathname));
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (redirectInProgress) {
          console.log("Redirect already in progress, skipping auth check");
          return;
        }

        setLoading(true);

        const accessToken = localStorage.getItem("access_token");
        console.log("AdminLayout init:", {
          hasAccessToken: !!accessToken,
          user: user ? "exists" : "null",
          isAuthenticated,
          isAuthorized,
        });

        if (!accessToken) {
          console.log("No access token, redirecting to login");
          setRedirectInProgress(true);
          router.push("/login?redirect=/admin");
          return;
        }

        if (!user) {
          console.log("No user data, fetching user");
          try {
            await dispatch(getMe()).unwrap();
            console.log("User data loaded successfully");
          } catch (error) {
            console.error("Error loading user data:", error);
            setError(
              "Ошибка загрузки данных пользователя. Возможно, ваша сессия истекла.",
            );
            setRedirectInProgress(true);
            router.push("/login?redirect=/admin");
            return;
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Admin panel initialization error:", error);
        setError("Произошла ошибка при инициализации административной панели.");
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch, router, isAuthenticated, redirectInProgress]);

  useEffect(() => {
    if (redirectInProgress) return;

    if (!loading && user) {
      console.log("Checking staff status:", user);

      if (typeof user.is_staff === "undefined") {
        console.log("Warning: is_staff is undefined in user data");
        setIsAuthorized(null);
      } else if (!user.is_staff) {
        console.log("User is not staff, redirecting to home");
        setRedirectInProgress(true);
        router.push("/");
        setIsAuthorized(false);
      } else {
        console.log("User is staff, authorized to access admin panel");
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router, redirectInProgress]);

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Проверка авторизации...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!user) {
    return <div className="loading">Проверка авторизации...</div>;
  }

  if (isAuthorized === null) {
    return <div className="loading">Проверка прав доступа...</div>;
  }

  if (isAuthorized === false) {
    return (
      <div className="loading">
        У вас нет прав для доступа к этой странице. Переадресация...
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />

      <main className="admin-main">
        <Header />
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
