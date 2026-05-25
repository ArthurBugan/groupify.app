import { TouchableOpacity, View, Text } from 'react-native';
import { Input as TextInput } from 'heroui-native';
import { useState, useCallback, useRef } from 'react';
import BottomSheet, { BottomSheetFlatList, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { useTheme } from '@/theme/ThemeProvider';
import { getThemeColor } from '@/theme/themeColors';
import { Portal } from 'react-native-portalize';

interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
}

const getGroupIcon = (icon?: string) => {
  if (icon) return icon;
  return 'lucide:folder';
};

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  error,
}: SelectProps) {
  const { isDark } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectedOption = options.find((opt) => opt.value === value);

  const filteredOptions = searchTerm
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = useCallback(
    (itemValue: string) => {
      onChange(itemValue);
      setIsOpen(false);
      setSearchTerm('');
    },
    [onChange]
  );

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
    if (newOpen) {
      bottomSheetRef.current?.expand();
      setSearchTerm('');
    } else {
      bottomSheetRef.current?.close();
      setSearchTerm('');
    }
  }, []);


  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-foreground mb-1.5">{label}</Text>
      )}
      <TouchableOpacity
        onPress={() => handleOpenChange(true)}
        className={`bg-field-background border rounded-xl px-4 py-3 flex-row items-center gap-3 ${
          error ? 'border-danger' : 'border-border'
        }`}
        style={{ borderWidth: 1.5 }}
        activeOpacity={0.7}
      >
        {selectedOption?.icon && (
          <View className="w-6 h-6 items-center justify-center">
            <IconifyIcon name={getGroupIcon(selectedOption.icon)} size={18} />
          </View>
        )}
        <Text className={`flex-1 ${selectedOption ? 'text-foreground' : 'text-muted'}`} numberOfLines={1}>
          {selectedOption?.label || placeholder}
        </Text>
        <IconifyIcon 
          name="lucide:chevron-down" 
          size={18} 
          color={getThemeColor('muted', isDark)} 
        />
      </TouchableOpacity>

      {error && <Text className="text-xs text-danger mt-1.5 ml-1">{error}</Text>}

      {/* Bottom Sheet — portaled to root so it covers the whole app */}
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={isOpen ? 0 : -1}
          enableDynamicSizing={false}
          handleIndicatorStyle={{
            backgroundColor: getThemeColor('muted-foreground', isDark),
          }}
          backgroundStyle={{
            backgroundColor: getThemeColor('background', isDark),
          }}
        >
          <BottomSheetView style={{ flex: 1, padding: 16 }}>
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-foreground">
                {label || 'Select'}
              </Text>
              <TouchableOpacity onPress={() => handleOpenChange(false)}>
                <IconifyIcon name="lucide:x" color={getThemeColor('muted-foreground', isDark)} size={20} />
              </TouchableOpacity>
            </View>

            <View className='mb-4'>
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search..."
                placeholderTextColor={getThemeColor('muted-foreground', isDark)}
              />
            </View>

            <BottomSheetFlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              className="flex-1"
              ListFooterComponent={<View style={{ height: 140 }} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  className="flex-row items-center gap-3 p-4 border-b"
                  style={{
                    borderBottomColor: getThemeColor('border', isDark),
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: getThemeColor('surface-secondary', isDark) }}
                  >
                    <IconifyIcon
                      name={item.icon ? getGroupIcon(item.icon) : 'lucide:folder'}
                      size={18}
                    />
                  </View>
                  <Text
                    className={`flex-1 text-base ${
                      item.value === value
                        ? 'text-accent font-medium'
                        : 'text-foreground'
                    }`}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <IconifyIcon
                      name="lucide:check"
                      size={18}
                      color={getThemeColor('accent', isDark)}
                    />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View className="py-8 items-center">
                  <Text className="text-muted">No results found</Text>
                </View>
              }
            />
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    </View>
  );
}

export default Select;
