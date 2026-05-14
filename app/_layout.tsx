import "react-native-url-polyfill/auto";

import { AuthProvider } from "@/src/Context/AuthContext";
import RootNavigation from "@/src/Context/RootNavigation";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}