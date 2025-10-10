import { useMemo } from "react";
import { FloatingDevTools, type InstalledApp } from "@react-buoy/core";
import { createEnvVarConfig, envVar } from "@react-buoy/env";
import { NetworkModal } from "@react-buoy/network";
import { ReactQueryDevToolsModal } from "@react-buoy/react-query";
import { ReactQueryIcon, Globe } from "@react-buoy/shared-ui";

export function BuoyDebugger() {
  // Configure environment variables to validate
  const requiredEnvVars = createEnvVarConfig([
    envVar("EXPO_PUBLIC_API_URL").exists(),
    envVar("EXPO_PUBLIC_DEBUG_MODE").withType("boolean").build(),
    envVar("EXPO_PUBLIC_ENVIRONMENT").withValue("development").build(),
  ]);

  // Configure all development tools
  const installedApps: InstalledApp[] = useMemo(
    () => [
      {
        id: "network",
        name: "NETWORK",
        description: "Network request logger",
        slot: "both",
        icon: ({ size }) => <Globe size={size} color="#38bdf8" />,
        component: NetworkModal,
        props: {},
      },
      {
        id: "query",
        name: "REACT QUERY",
        description: "React Query inspector",
        slot: "both",
        icon: ({ size }) => <ReactQueryIcon size={size} colorPreset="red" />,
        component: ReactQueryDevToolsModal,
        props: {},
      },
    ],
    [requiredEnvVars]
  );

  return (
    <FloatingDevTools
      apps={installedApps}
      actions={{}}
      environment="local"
      userRole="admin"
    />
  );
}
