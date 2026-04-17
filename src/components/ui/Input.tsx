import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  editable?: boolean;
  className?: string;
}

export function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  className = '',
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </Text>
      )}
      <View className={`relative ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          className={`w-full bg-gray-50 dark:bg-gray-900 border rounded-lg px-4 py-3 text-gray-900 dark:text-white ${secureTextEntry ? 'pr-12' : ''} ${multiline ? 'h-24 text-start' : ''} ${!editable ? 'opacity-50' : ''} ${className}`}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
          >
            <Text className="text-gray-500">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
    </View>
  );
}

export default Input;