import React, { useEffect } from 'react';

import { Text, View } from 'react-native';
import { supabase } from "../../lib/supabase";

export default function TabLayout() {
  

 
    useEffect(() => {
    const testConnection = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.log('Supabase lỗi:', error.message)
      } else {
        console.log('Kết nối Supabase thành công:', data)
      }
    }

    testConnection()
  }, [])

  return (
    <View>
      <Text>Index</Text>
    </View>
  );
}
