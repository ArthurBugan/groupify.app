import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Input } from 'heroui-native';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { IconifyIcon } from '@/components/IconifyIcon';
import { useTheme } from '@/theme/ThemeProvider';
import { getThemeColor } from '@/theme/themeColors';
import BottomSheet, { BottomSheetFlatList } from '@expo/ui/community/bottom-sheet';
import { Portal } from 'react-native-portalize';

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
      setIsOpen(false);
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


  return (
    <View>
      {label && (
        <Text className="text-sm font-medium text-foreground mb-1">{label}</Text>
      )}

      {/* Trigger button */}
      <TouchableOpacity
        onPress={() => handleOpenChange(true)}
        className={`flex-row items-center bg-default border rounded-lg px-4 py-3 ${error ? 'border-danger' : 'border-border'
          }`}
      >
        <IconifyIcon name={value || 'lucide:folder'} size={20} />
        <Text className={`ml-3 flex-1 ${value ? 'text-foreground' : 'text-muted'}`}>
          {value || 'Select icon'}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-xs text-danger mt-1">{error}</Text>}

      {/* Bottom Sheet — portaled to root so it covers the whole app */}
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={isOpen ? 0 : -1}
          handleIndicatorStyle={{
            backgroundColor: getThemeColor('muted-foreground', isDark),
          }}
          backgroundStyle={{
            backgroundColor: getThemeColor('popover', isDark),
          }}
        >
          <View style={{ flex: 1 }}>
            {/* Header */}
            <View style={{ marginBottom: 12 }}>
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-foreground">Choose an Icon</Text>
                <TouchableOpacity onPress={() => handleOpenChange(false)}>
                  <IconifyIcon name="lucide:x" color={getThemeColor('muted-foreground', isDark)} size={20} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Input
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
              <View style={{ flex: 1 }}>
                <Text className="text-sm text-muted mb-2">
                  Found {filteredIcons.length} icons matching "{searchTerm}"
                </Text>
                <BottomSheetFlatList
                  data={filteredIcons}
                  numColumns={7}
                  keyExtractor={(item) => item}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                  ListFooterComponent={<View style={{ height: 20 }} />}
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
              <View style={{ flex: 1 }}>
                {/* Category tabs */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginBottom: 8 }}
                >
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat.key}
                      onPress={() => setActiveCategory(cat.key)}
                      className={`px-3 py-1.5 rounded-full mr-2 ${activeCategory === cat.key ? 'bg-accent' : 'bg-default'
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
                  ))}
                </ScrollView>

                {/* Icons grid */}
                <BottomSheetFlatList
                  data={activeIcons}
                  numColumns={7}
                  keyExtractor={(item) => item}
                  style={{ flex: 1 }}
                  contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
                  ListFooterComponent={<View style={{ height: 20 }} />}
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
          </View>
        </BottomSheet>
      </Portal>
    </View>
  );
}

export default IconPicker;

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
      className={`w-11 m-1 h-11 items-center justify-center rounded-lg ${isSelected ? 'bg-accent/20 border-2 border-primary' : 'bg-default'
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
