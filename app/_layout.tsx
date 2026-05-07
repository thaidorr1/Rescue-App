import "react-native-url-polyfill/auto";

import { AuthProvider } from "@/Context/AuthContext";
import RootNavigation from "@/Context/RootNavigation";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}