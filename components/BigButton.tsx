import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { Colors, ButtonSizes, BorderRadius, FontSizes } from '../constants/styles';

interface BigButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export const BigButton: React.FC<BigButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  icon,
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      height: ButtonSizes[size].height,
      paddingHorizontal: ButtonSizes[size].paddingHorizontal,
      borderRadius: BorderRadius.lg,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      flexDirection: 'row' as const,
      gap: 12,
    };

    if (disabled || loading) {
      return {
        ...baseStyle,
        backgroundColor: Colors.disabled,
        opacity: 0.6,
      };
    }

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: Colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: Colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: Colors.primary,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: size === 'large' ? FontSizes.lg : size === 'medium' ? FontSizes.base : FontSizes.sm,
      fontWeight: '700' as const,
    };

    if (variant === 'outline') {
      return {
        ...baseStyle,
        color: Colors.primary,
      };
    }

    return {
      ...baseStyle,
      color: Colors.background,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? Colors.primary : Colors.background} />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};
