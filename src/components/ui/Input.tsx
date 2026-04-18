import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/theme/ThemeProvider';

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
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-foreground mb-1">
          {label}
        </Text>
      )}
      <View className={`relative ${error ? 'border-destructive' : 'border-input'}`}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#94a3b8' : '#9CA3AF'}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          className={`w-full bg-secondary border rounded-lg px-4 py-3 text-foreground ${secureTextEntry ? 'pr-12' : ''} ${multiline ? 'h-24 text-start' : ''} ${!editable ? 'opacity-50' : ''} ${className}`}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
          >
            <Text className="text-muted-foreground">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-sm text-destructive mt-1">{error}</Text>}
    </View>
  );
}

export default Input;