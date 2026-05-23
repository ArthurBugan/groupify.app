import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { TextField, Input as TextInput } from 'heroui-native';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IconifyIcon } from '@/components/ui/IconifyIcon';
import { useTheme } from '@/theme/ThemeProvider';
import { getThemeColor } from '@/theme/themeColors';
import BottomSheet, { BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Portal } from 'react-native-portalize';
import { FlashList } from '@shopify/flash-list';

// Timer for debouncing search
let searchTimer: ReturnType<typeof setTimeout>;

interface Category {
  name: string;
  key: string;
  icons: string[];
}

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

export function IconPicker({ value, onChange, label, error }: IconPickerProps) {
  const { isDark } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch twemoji categories on mount
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          'https://api.iconify.design/collection?prefix=twemoji&chars=true&aliases=true'
        ).then((r) => r.json());

        const cats: Category[] = Object.keys(resp.categories).map((category) => ({
          name: category,
          key: category,
          icons: resp.categories[category],
        }));
        setCategories(cats);
        setActiveCategory(cats[0]?.key || '');
      } catch {
        // fallback
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleIconSelect = useCallback(
    (iconName: string) => {
      const formatted = iconName.includes(':') ? iconName : `twemoji:${iconName}`;
      onChange(formatted);
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

  const handleFilter = useCallback((text: string) => {
    setSearchTerm(text);
    clearTimeout(searchTimer);

    searchTimer = setTimeout(async () => {
      if (text.trim() === '') {
        setFilteredIcons([]);
        return;
      }

      try {
        const resp = await fetch(
          `https://api.iconify.design/search?query=${encodeURIComponent(text)}&limit=200`
        ).then((r) => r.json());
        setFilteredIcons(resp?.icons || []);
      } catch {
        setFilteredIcons([]);
      }
    }, 500);
  }, []);

  const activeIcons = activeCategory
    ? categories.find((c) => c.key === activeCategory)?.icons || []
    : [];

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
    <View>
      {label && (
        <Text className="text-sm font-medium text-foreground mb-1">{label}</Text>
      )}

      {/* Trigger button */}
      <TouchableOpacity
        onPress={() => handleOpenChange(true)}
        className={`flex-row items-center justify-between bg-default border rounded-lg px-4 py-3 ${error ? 'border-danger' : 'border-border'
          }`}
      >
        <View className="flex-row items-center gap-3">
          <IconifyIcon name={value || 'lucide:folder'} size={20} />
          {value ? (
            <Text className="text-foreground text-sm">{value}</Text>
          ) : (
            <Text className="text-muted text-sm">Select icon</Text>
          )}
        </View>
        <Text className="text-muted text-sm">🔍</Text>
      </TouchableOpacity>

      {error && <Text className="text-xs text-danger mt-1">{error}</Text>}

      {/* Bottom Sheet — portaled to root so it covers the whole app */}
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={isOpen ? 0 : -1}
          snapPoints={['85%']}
          backdropComponent={renderBackdrop}
          enableDynamicSizing={false}
          handleIndicatorStyle={{
            backgroundColor: getThemeColor('muted-foreground', isDark),
          }}
          backgroundStyle={{
            backgroundColor: getThemeColor('popover', isDark),
          }}
        >
          <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
            {/* Header */}
            <Text className="text-lg font-bold text-foreground mb-3">Choose an Icon</Text>

            {/* Search */}
            <View
              className='mb-4 position-relative'
            >
                <TextInput
                  value={searchTerm}
                  onChangeText={handleFilter}
                  placeholder="Search icons..."
                  placeholderTextColor={getThemeColor('muted-foreground', isDark)}
                />
            </View>

            {/* Content */}
            {isLoading ? (
              <View className="items-center py-10">
                <Text className="text-muted">Loading icons...</Text>
              </View>
            ) : searchTerm ? (
              <View>
                <Text className="text-sm text-muted mb-2">
                  Found {filteredIcons.length} icons matching "{searchTerm}"
                </Text>
                <FlashList
                  data={filteredIcons}
                  numColumns={6}
                  keyExtractor={(item) => item}
                  renderItem={({ item: iconName }) => (
                    <IconButton
                      iconName={iconName}
                      selectedValue={value}
                      onSelect={handleIconSelect}
                      isDark={isDark}
                    />
                  )}
                />
              </View>
            ) : (
              <View>
                {/* Category tabs */}
                <FlashList
                  data={categories}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.key}
                  contentContainerStyle={{ gap: 4, marginBottom: 12 }}
                  renderItem={({ item: cat }) => (
                    <TouchableOpacity
                      onPress={() => setActiveCategory(cat.key)}
                      className={`px-3 m-1 py-1.5 rounded-full ${activeCategory === cat.key ? 'bg-accent' : 'bg-default'
                        }`}
                    >
                      <Text
                        className={`text-xs font-medium ${activeCategory === cat.key
                            ? 'text-accent-foreground'
                            : 'text-muted'
                          }`}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  )}
                />

                {/* Icons grid */}
                <FlashList
                  data={activeIcons}
                  numColumns={6}
                  keyExtractor={(item) => item}
                  renderItem={({ item: iconName }) => (
                    <IconButton
                      iconName={iconName}
                      selectedValue={value}
                      onSelect={handleIconSelect}
                      isDark={isDark}
                    />
                  )}
                />
              </View>
            )}
          </BottomSheetScrollView>
        </BottomSheet>
      </Portal>
    </View>
  );
}

interface IconButtonProps {
  iconName: string;
  selectedValue: string;
  onSelect: (iconName: string) => void;
  isDark: boolean;
}

function IconButton({ iconName, selectedValue, onSelect, isDark }: IconButtonProps) {
  const displayName = iconName.includes(':') ? iconName : `twemoji:${iconName}`;
  const isSelected = selectedValue === displayName;

  return (
    <TouchableOpacity
      onPress={() => onSelect(displayName)}
      className={`w-12 m-1 h-12 items-center justify-center rounded-lg ${isSelected ? 'bg-accent/20 border-2 border-primary' : 'bg-default'
        }`}
    >
      <IconifyIcon name={displayName} size={24} />
      {isSelected && (
        <View className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full items-center justify-center">
          <Text className="text-accent-foreground text-xs">✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
