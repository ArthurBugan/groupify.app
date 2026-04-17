import { TouchableOpacity, View, Text } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <TouchableOpacity onPress={() => onChange(!checked)} className="flex-row items-center">
      <View
        className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-2 ${
          checked
            ? 'bg-blue-500 border-blue-500'
            : 'border-gray-300 dark:border-gray-600'
        }`}
      >
        {checked && <Text className="text-white text-xs">✓</Text>}
      </View>
      {label && <Text className="text-gray-700 dark:text-gray-300">{label}</Text>}
    </TouchableOpacity>
  );
}

export default Checkbox;