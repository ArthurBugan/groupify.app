import { TouchableOpacity, View, Text, Modal, FlatList } from 'react-native';
import { useState } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
}

export function Select({ value, onChange, options, placeholder = 'Select...', label }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3"
      >
        <Text className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
          {selectedOption?.label || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="slide">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-white dark:bg-gray-800 rounded-t-xl p-4 max-h-96">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {label || 'Select'}
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}
                  className="p-4 border-b border-gray-200 dark:border-gray-700"
                >
                  <Text
                    className={`text-base ${
                      item.value === value
                        ? 'text-primary font-medium'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

export default Select;