import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Resume } from '../types/resume';
import { Colors, FontSizes, Spacing, BorderRadius } from '../constants/styles';

interface ResumeCardProps {
  resume: Resume;
  onPress: () => void;
  onDelete: () => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onPress, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderWidth: 2,
        borderColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      activeOpacity={0.7}
    >
      <View style={{ marginBottom: Spacing.sm }}>
        <Text style={{ fontSize: FontSizes.lg, fontWeight: '700', color: Colors.text }}>
          {resume.basicInfo.name}
        </Text>
        <Text style={{ fontSize: FontSizes.sm, color: Colors.disabled, marginTop: 4 }}>
          {resume.basicInfo.age}세 • {resume.basicInfo.phone}
        </Text>
      </View>

      <View style={{ marginBottom: Spacing.sm }}>
        <Text style={{ fontSize: FontSizes.base, color: Colors.text }} numberOfLines={2}>
          {resume.desiredJob}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: Spacing.sm,
        }}
      >
        <Text style={{ fontSize: FontSizes.xs, color: Colors.disabled }}>
          {formatDate(resume.updatedAt)}
        </Text>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            backgroundColor: Colors.error,
            borderRadius: BorderRadius.sm,
          }}
        >
          <Text style={{ fontSize: FontSizes.xs, color: Colors.background, fontWeight: '600' }}>
            삭제
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
