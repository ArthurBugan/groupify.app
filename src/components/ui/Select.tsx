import { TouchableOpacity, View, Text } from 'react-native';
import { Input as TextInput } from 'heroui-native';
import { useState, useCallback, useRef } from 'react';
import BottomSheet, { BottomSheetFlatList, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
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

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-foreground mb-1">{label}</Text>
      )}
      <TouchableOpacity
        onPress={() => handleOpenChange(true)}
        className={`bg-default border rounded-lg px-4 py-3 ${
          error ? 'border-danger' : 'border-border'
        }`}
      >
        <Text className={selectedOption ? 'text-foreground' : 'text-muted'}>
          {selectedOption?.label || placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-xs text-danger mt-1">{error}</Text>}

      {/* Bottom Sheet — portaled to root so it covers the whole app */}
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={isOpen ? 0 : -1}
          snapPoints={['60%']}
          backdropComponent={renderBackdrop}
          enableDynamicSizing={false}
          handleIndicatorStyle={{
            backgroundColor: getThemeColor('muted-foreground', isDark),
          }}
          backgroundStyle={{
            backgroundColor: getThemeColor('popover', isDark),
          }}
        >
          <View style={{ padding: 16 }}>
            <Text className="text-lg font-bold text-foreground mb-3">
              {label || 'Select'}
            </Text>

            {/* Search */}
            <View
              className="flex-row items-center gap-2 mb-3 rounded-lg px-3 py-2"
              style={{ backgroundColor: getThemeColor('secondary', isDark) }}
            >
              <Text className="text-muted">🔍</Text>
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search..."
                placeholderTextColor={getThemeColor('muted-foreground', isDark)}
              />
              {searchTerm !== '' && (
                <TouchableOpacity onPress={() => setSearchTerm('')}>
                  <Text className="text-muted text-lg">✕</Text>
                </TouchableOpacity>
              )}
            </View>

            <BottomSheetFlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  className="flex-row items-center gap-3 p-4 border-b"
                  style={{
                    borderBottomColor: getThemeColor('border', isDark),
                  }}
                >
                  <View
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: getThemeColor('muted', isDark) }}
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
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <IconifyIcon
                      name="lucide:check"
                      size={18}
                      color={getThemeColor('primary', isDark)}
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
          </View>
        </BottomSheet>
      </Portal>
    </View>
  );
}

export default Select;
