// PDF Generator using react-native-html-to-pdf
import { Resume } from '../types/resume';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export interface PDFOptions {
  fileName?: string;
  directory?: string;
}

// react-native-html-to-pdf를 동적으로 import
let RNHTMLtoPDF: any = null;
try {
  RNHTMLtoPDF = require('react-native-html-to-pdf');
  console.log('[PDF] react-native-html-to-pdf loaded');
} catch (error) {
  console.warn('[PDF] react-native-html-to-pdf not available:', error);
}

/**
 * 이력서를 HTML로 변환
 * 50+ 연령층을 위한 큰 글씨, 깔끔한 1페이지 템플릿
 */
function generateResumeHTML(resume: Resume): string {
  const { basicInfo, experience, skills, desiredJob, workConditions, introduction } = resume;

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${basicInfo.name} 이력서</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', sans-serif;
      padding: 40px;
      background: white;
      color: #1a1a1a;
      line-height: 1.8;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #2563EB;
    }

    .name {
      font-size: 36px;
      font-weight: bold;
      color: #2563EB;
      margin-bottom: 15px;
    }

    .basic-info {
      font-size: 18px;
      color: #4b5563;
      margin-bottom: 8px;
    }

    .section {
      margin-bottom: 35px;
    }

    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: #2563EB;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }

    .section-content {
      font-size: 18px;
      color: #374151;
      white-space: pre-wrap;
      line-height: 2;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 15px;
    }

    .info-item {
      font-size: 18px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
    }

    .info-label {
      font-weight: bold;
      color: #6b7280;
      margin-right: 8px;
    }

    .footer {
      margin-top: 50px;
      text-align: center;
      font-size: 16px;
      color: #9ca3af;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }

    @media print {
      body {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <!-- 헤더: 기본 정보 -->
  <div class="header">
    <div class="name">${basicInfo.name}</div>
    <div class="basic-info">나이: ${basicInfo.age}세 | 연락처: ${basicInfo.phone}</div>
    ${basicInfo.email ? `<div class="basic-info">이메일: ${basicInfo.email}</div>` : ''}
  </div>

  <!-- 자기소개 -->
  ${
    introduction
      ? `
  <div class="section">
    <div class="section-title">자기소개</div>
    <div class="section-content">${introduction}</div>
  </div>
  `
      : ''
  }

  <!-- 희망 직무 및 근무 조건 -->
  <div class="section">
    <div class="section-title">희망 직무</div>
    <div class="section-content">${desiredJob}</div>

    <div class="info-grid">
      ${workConditions.location ? `<div class="info-item"><span class="info-label">근무 지역:</span>${workConditions.location}</div>` : ''}
      ${workConditions.time ? `<div class="info-item"><span class="info-label">근무 시간:</span>${workConditions.time}</div>` : ''}
      ${workConditions.type ? `<div class="info-item"><span class="info-label">고용 형태:</span>${workConditions.type}</div>` : ''}
    </div>
  </div>

  <!-- 경력 사항 -->
  ${
    experience
      ? `
  <div class="section">
    <div class="section-title">경력 사항</div>
    <div class="section-content">${experience}</div>
  </div>
  `
      : ''
  }

  <!-- 보유 스킬 -->
  ${
    skills
      ? `
  <div class="section">
    <div class="section-title">보유 스킬 및 자격</div>
    <div class="section-content">${skills}</div>
  </div>
  `
      : ''
  }

  <!-- 푸터 -->
  <div class="footer">
    레쥬미 - 말하는 이력서로 작성됨 | ${new Date().toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })}
  </div>
</body>
</html>
  `;
}

/**
 * 이력서 데이터를 PDF 파일로 생성
 */
export async function generateResumePDF(resume: Resume, options: PDFOptions = {}): Promise<string> {
  console.log('[PDF] Starting PDF generation...');

  // react-native-html-to-pdf가 없으면 HTML 파일로 저장
  if (!RNHTMLtoPDF || !RNHTMLtoPDF.default) {
    console.warn('[PDF] HTML-to-PDF not available, saving as HTML instead');
    return await generateResumeHTML_File(resume, options);
  }

  try {
    const html = generateResumeHTML(resume);
    console.log('[PDF] HTML generated, converting to PDF...');

    const fileName = options.fileName || `${resume.basicInfo.name}_이력서.pdf`;

    const result = await RNHTMLtoPDF.default.convert({
      html,
      fileName: fileName.replace('.pdf', ''),
      base64: false,
      directory: 'Documents',
    });

    console.log('[PDF] PDF generation result:', result);

    if (result.filePath) {
      console.log('[PDF] PDF 생성 완료:', result.filePath);
      return result.filePath;
    } else {
      throw new Error('PDF 생성 실패: 파일 경로가 없습니다.');
    }
  } catch (error) {
    console.error('[PDF] PDF 생성 오류:', error);
    // 실패하면 HTML로 저장
    console.log('[PDF] Falling back to HTML file...');
    return await generateResumeHTML_File(resume, options);
  }
}

/**
 * HTML 파일로 저장 (PDF 생성 실패 시 대안)
 */
async function generateResumeHTML_File(resume: Resume, options: PDFOptions = {}): Promise<string> {
  try {
    const html = generateResumeHTML(resume);
    const fileName = (options.fileName || `${resume.basicInfo.name}_이력서.html`).replace('.pdf', '.html');
    const filePath = `${FileSystem.documentDirectory}${fileName}`;

    await FileSystem.writeAsStringAsync(filePath, html, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log('[PDF] HTML 파일 생성 완료:', filePath);
    return filePath;
  } catch (error) {
    console.error('[PDF] HTML 파일 생성 오류:', error);
    throw error;
  }
}

/**
 * PDF 파일을 Base64로 변환 (공유 등에 사용)
 */
export async function generateResumePDFBase64(resume: Resume): Promise<string> {
  try {
    const html = generateResumeHTML(resume);

    const result = await RNHTMLtoPDF.convert({
      html,
      fileName: `${resume.basicInfo.name}_이력서`,
      base64: true,
    });

    if (result.base64) {
      return result.base64;
    } else {
      throw new Error('PDF Base64 생성 실패');
    }
  } catch (error) {
    console.error('PDF Base64 생성 오류:', error);
    throw error;
  }
}

/**
 * HTML 템플릿 미리보기 (테스트용)
 */
export function previewResumeHTML(resume: Resume): string {
  return generateResumeHTML(resume);
}
