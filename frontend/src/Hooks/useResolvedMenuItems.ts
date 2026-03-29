import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import menuItems from "../assets/components/constants/menu";

interface MenuItem {
  name: string;
  href: string;
  icon: any;
}

interface ResolvedMenuItems {
  left: MenuItem[];
  center: MenuItem[];
  right: MenuItem[];
}

/**
 * Hook that resolves menu items based on authentication state.
 * Applies auth-dependent logic (e.g., Profile href based on login state).
 * @returns Organized menu items with auth context applied
 */
export const useResolvedMenuItems = (): ResolvedMenuItems => {
  const { isAuthenticated } = useAuth();

  return useMemo(
    () => ({
      left: menuItems.left,
      center: menuItems.center,
      right: menuItems.right.map((item) =>
        item.name === "Profile"
          ? { ...item, href: isAuthenticated ? "/profile" : "/login" }
          : item,
      ),
    }),
    [isAuthenticated],
  );
};
