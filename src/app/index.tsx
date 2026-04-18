import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/stores';

// export default function Index() {
//   const checkAuth = useAuthStore((s) => s.checkAuth);
//   const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function init() {
//       await checkAuth();
//       setIsLoading(false);
//     }
//     init();
//   }, []);

//   if (isLoading) {
//     return (
//       <View className="flex-1 items-center justify-center bg-background">
//         <ActivityIndicator size="large" color="#f43f5e" />
//       </View>
//     );
//   }

//   if (isAuthenticated) {
//     return <Redirect href="/(app)" />;
//   }

//   return <Redirect href="/(auth)/login" />;
// }

export default function Index() {
  return <Redirect href="/(auth)/login" />;
}