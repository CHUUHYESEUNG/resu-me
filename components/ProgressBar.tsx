import React from 'react';
import { View, Text } from 'react-native';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/styles';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  showLabel = true,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={{ paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md }}>
      {showLabel && (
        <Text
          style={{
            fontSize: FontSizes.base,
            color: Colors.text,
            fontWeight: '600',
            marginBottom: Spacing.sm,
            textAlign: 'center',
          }}
        >
          {currentStep} / {totalSteps} 단계
        </Text>
      )}
      <View
        style={{
          height: 12,
          backgroundColor: Colors.border,
          borderRadius: BorderRadius.full,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: Colors.primary,
            borderRadius: BorderRadius.full,
          }}
        />
      </View>
    </View>
  );
};
