import { TouchableOpacity, View, Text } from 'react-native';

interface CheckboxProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <TouchableOpacity onPress={onChange} className="flex-row items-center">
      <View
        className="w-5 h-5 rounded border-2 flex items-center justify-center mr-2"
        style={{
          backgroundColor: checked ? '#f43f5e' : 'transparent',
          borderColor: checked ? '#f43f5e' : '#94a3b8',
        }}
      >
        {checked && <Text className="text-white text-xs">✓</Text>}
      </View>
      {label && <Text className="text-foreground">{label}</Text>}
    </TouchableOpacity>
  );
}

export default Checkbox;