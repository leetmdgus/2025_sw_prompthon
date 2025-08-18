"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { User, Heart, Brain, Home, Users, Activity, Target, AlertTriangle, CheckCircle, FileText } from "lucide-react"

interface AssessmentData {
  personalInfo: {
    age: number
    gender: string
    education: string
    maritalStatus: string
    livingArrangement: string
    primaryLanguage: string
  }
  medicalHistory: {
    chronicConditions: string[]
    currentMedications: string[]
    recentHospitalizations: string
    cognitiveIssues: string
    physicalLimitations: string[]
  }
  socialSupport: {
    familyContact: string
    friendsContact: string
    communityInvolvement: string
    caregiverAvailable: boolean
    emergencyContact: string
  }
  functionalAssessment: {
    adlScore: number // Activities of Daily Living
    iadlScore: number // Instrumental Activities of Daily Living
    mobilityLevel: string
    safetyRisks: string[]
  }
  mentalHealthScreening: {
    depressionScore: number // PHQ-9 style
    anxietyScore: number // GAD-7 style
    lonelinessScore: number
    cognitiveScore: number // Mini-Mental State style
    suicidalIdeation: boolean
  }
  psychosocialFactors: {
    recentLosses: string
    majorLifeChanges: string
    copingStrategies: string[]
    spiritualNeeds: string
    culturalConsiderations: string
  }
  goalsAndExpectations: {
    clientGoals: string[]
    counselingExpectations: string
    preferredApproach: string
    motivationLevel: number
  }
}

export default function ComprehensiveFirstVisitAssessment({
  clientName,
  onComplete,
}: {
  clientName: string
  onComplete: (data: AssessmentData) => void
}) {
  const [currentSection, setCurrentSection] = useState(0)
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    personalInfo: {
      age: 0,
      gender: "",
      education: "",
      maritalStatus: "",
      livingArrangement: "",
      primaryLanguage: "한국어",
    },
    medicalHistory: {
      chronicConditions: [],
      currentMedications: [],
      recentHospitalizations: "",
      cognitiveIssues: "",
      physicalLimitations: [],
    },
    socialSupport: {
      familyContact: "",
      friendsContact: "",
      communityInvolvement: "",
      caregiverAvailable: false,
      emergencyContact: "",
    },
    functionalAssessment: {
      adlScore: 0,
      iadlScore: 0,
      mobilityLevel: "",
      safetyRisks: [],
    },
    mentalHealthScreening: {
      depressionScore: 0,
      anxietyScore: 0,
      lonelinessScore: 0,
      cognitiveScore: 0,
      suicidalIdeation: false,
    },
    psychosocialFactors: {
      recentLosses: "",
      majorLifeChanges: "",
      copingStrategies: [],
      spiritualNeeds: "",
      culturalConsiderations: "",
    },
    goalsAndExpectations: {
      clientGoals: [],
      counselingExpectations: "",
      preferredApproach: "",
      motivationLevel: 5,
    },
  })

  const sections = [
    { title: "기본 정보", icon: User, color: "text-blue-600" },
    { title: "의료 이력", icon: Heart, color: "text-red-600" },
    { title: "사회적 지지", icon: Users, color: "text-green-600" },
    { title: "기능 평가", icon: Activity, color: "text-orange-600" },
    { title: "정신건강 선별", icon: Brain, color: "text-purple-600" },
    { title: "심리사회적 요인", icon: Home, color: "text-teal-600" },
    { title: "목표 및 기대", icon: Target, color: "text-emerald-600" },
  ]

  const progress = ((currentSection + 1) / sections.length) * 100

  const updateAssessmentData = (section: keyof AssessmentData, field: string, value: any) => {
    setAssessmentData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const addToArray = (section: keyof AssessmentData, field: string, value: string) => {
    setAssessmentData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section][field] as string[]), value],
      },
    }))
  }

  const removeFromArray = (section: keyof AssessmentData, field: string, index: number) => {
    setAssessmentData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section][field] as string[]).filter((_, i) => i !== index),
      },
    }))
  }

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">나이</Label>
          <Input
            id="age"
            type="number"
            value={assessmentData.personalInfo.age || ""}
            onChange={(e) => updateAssessmentData("personalInfo", "age", Number.parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label>성별</Label>
          <RadioGroup
            value={assessmentData.personalInfo.gender}
            onValueChange={(value) => updateAssessmentData("personalInfo", "gender", value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="남성" id="male" />
              <Label htmlFor="male">남성</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="여성" id="female" />
              <Label htmlFor="female">여성</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div>
        <Label>교육 수준</Label>
        <RadioGroup
          value={assessmentData.personalInfo.education}
          onValueChange={(value) => updateAssessmentData("personalInfo", "education", value)}
          className="grid grid-cols-2 gap-2 mt-2"
        >
          {["무학", "초등학교", "중학교", "고등학교", "대학교", "대학원"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <RadioGroupItem value={level} id={level} />
              <Label htmlFor={level}>{level}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label>결혼 상태</Label>
        <RadioGroup
          value={assessmentData.personalInfo.maritalStatus}
          onValueChange={(value) => updateAssessmentData("personalInfo", "maritalStatus", value)}
          className="grid grid-cols-2 gap-2 mt-2"
        >
          {["기혼", "미혼", "이혼", "사별", "별거"].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <RadioGroupItem value={status} id={status} />
              <Label htmlFor={status}>{status}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label>거주 형태</Label>
        <RadioGroup
          value={assessmentData.personalInfo.livingArrangement}
          onValueChange={(value) => updateAssessmentData("personalInfo", "livingArrangement", value)}
          className="grid grid-cols-1 gap-2 mt-2"
        >
          {["혼자 거주", "배우자와 거주", "자녀와 거주", "기타 가족과 거주", "시설 거주"].map((arrangement) => (
            <div key={arrangement} className="flex items-center space-x-2">
              <RadioGroupItem value={arrangement} id={arrangement} />
              <Label htmlFor={arrangement}>{arrangement}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <div>
        <Label>만성 질환 (해당사항 모두 선택)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {["고혈압", "당뇨병", "심장병", "뇌졸중", "관절염", "골다공증", "치매", "우울증", "불안장애", "기타"].map(
            (condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={assessmentData.medicalHistory.chronicConditions.includes(condition)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addToArray("medicalHistory", "chronicConditions", condition)
                    } else {
                      const index = assessmentData.medicalHistory.chronicConditions.indexOf(condition)
                      if (index > -1) removeFromArray("medicalHistory", "chronicConditions", index)
                    }
                  }}
                />
                <Label htmlFor={condition}>{condition}</Label>
              </div>
            ),
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="medications">현재 복용 중인 약물</Label>
        <Textarea
          id="medications"
          placeholder="복용 중인 약물명과 용량을 입력해주세요..."
          value={assessmentData.medicalHistory.currentMedications.join("\n")}
          onChange={(e) =>
            updateAssessmentData(
              "medicalHistory",
              "currentMedications",
              e.target.value.split("\n").filter((med) => med.trim()),
            )
          }
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="hospitalizations">최근 6개월 내 입원 이력</Label>
        <Textarea
          id="hospitalizations"
          placeholder="입원 사유와 기간을 입력해주세요..."
          value={assessmentData.medicalHistory.recentHospitalizations}
          onChange={(e) => updateAssessmentData("medicalHistory", "recentHospitalizations", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="cognitive">인지 기능 관련 문제</Label>
        <Textarea
          id="cognitive"
          placeholder="기억력, 판단력, 언어능력 등의 문제가 있다면 입력해주세요..."
          value={assessmentData.medicalHistory.cognitiveIssues}
          onChange={(e) => updateAssessmentData("medicalHistory", "cognitiveIssues", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label>신체적 제약사항 (해당사항 모두 선택)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {["시력 문제", "청력 문제", "보행 장애", "손목/손가락 사용 제한", "만성 통증", "균형감각 문제"].map(
            (limitation) => (
              <div key={limitation} className="flex items-center space-x-2">
                <Checkbox
                  id={limitation}
                  checked={assessmentData.medicalHistory.physicalLimitations.includes(limitation)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      addToArray("medicalHistory", "physicalLimitations", limitation)
                    } else {
                      const index = assessmentData.medicalHistory.physicalLimitations.indexOf(limitation)
                      if (index > -1) removeFromArray("medicalHistory", "physicalLimitations", index)
                    }
                  }}
                />
                <Label htmlFor={limitation}>{limitation}</Label>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )

  const renderSocialSupport = () => (
    <div className="space-y-6">
      <div>
        <Label>가족과의 연락 빈도</Label>
        <RadioGroup
          value={assessmentData.socialSupport.familyContact}
          onValueChange={(value) => updateAssessmentData("socialSupport", "familyContact", value)}
          className="grid grid-cols-1 gap-2 mt-2"
        >
          {["매일", "주 2-3회", "주 1회", "월 1-2회", "거의 없음", "전혀 없음"].map((frequency) => (
            <div key={frequency} className="flex items-center space-x-2">
              <RadioGroupItem value={frequency} id={`family-${frequency}`} />
              <Label htmlFor={`family-${frequency}`}>{frequency}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label>친구/지인과의 연락 빈도</Label>
        <RadioGroup
          value={assessmentData.socialSupport.friendsContact}
          onValueChange={(value) => updateAssessmentData("socialSupport", "friendsContact", value)}
          className="grid grid-cols-1 gap-2 mt-2"
        >
          {["매일", "주 2-3회", "주 1회", "월 1-2회", "거의 없음", "전혀 없음"].map((frequency) => (
            <div key={frequency} className="flex items-center space-x-2">
              <RadioGroupItem value={frequency} id={`friends-${frequency}`} />
              <Label htmlFor={`friends-${frequency}`}>{frequency}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label>지역사회 활동 참여</Label>
        <RadioGroup
          value={assessmentData.socialSupport.communityInvolvement}
          onValueChange={(value) => updateAssessmentData("socialSupport", "communityInvolvement", value)}
          className="grid grid-cols-1 gap-2 mt-2"
        >
          {["적극적 참여", "가끔 참여", "관심 있으나 참여 어려움", "관심 없음", "참여 불가능"].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <RadioGroupItem value={level} id={`community-${level}`} />
              <Label htmlFor={`community-${level}`}>{level}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="caregiver"
          checked={assessmentData.socialSupport.caregiverAvailable}
          onCheckedChange={(checked) => updateAssessmentData("socialSupport", "caregiverAvailable", checked)}
        />
        <Label htmlFor="caregiver">도움을 받을 수 있는 돌봄자가 있음</Label>
      </div>

      <div>
        <Label htmlFor="emergency">비상 연락처</Label>
        <Input
          id="emergency"
          placeholder="이름, 관계, 연락처를 입력해주세요"
          value={assessmentData.socialSupport.emergencyContact}
          onChange={(e) => updateAssessmentData("socialSupport", "emergencyContact", e.target.value)}
        />
      </div>
    </div>
  )

  const renderFunctionalAssessment = () => (
    <div className="space-y-6">
      <div>
        <Label>일상생활 수행능력 (ADL) 점수 (0-10)</Label>
        <div className="mt-2">
          <Slider
            value={[assessmentData.functionalAssessment.adlScore]}
            onValueChange={(value) => updateAssessmentData("functionalAssessment", "adlScore", value[0])}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>완전 의존</span>
            <span className="font-medium">{assessmentData.functionalAssessment.adlScore}</span>
            <span>완전 독립</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-1">목욕, 옷입기, 화장실 사용, 식사, 이동 등의 기본 활동 수행 능력</p>
      </div>

      <div>
        <Label>도구적 일상생활 수행능력 (IADL) 점수 (0-10)</Label>
        <div className="mt-2">
          <Slider
            value={[assessmentData.functionalAssessment.iadlScore]}
            onValueChange={(value) => updateAssessmentData("functionalAssessment", "iadlScore", value[0])}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>완전 의존</span>
            <span className="font-medium">{assessmentData.functionalAssessment.iadlScore}</span>
            <span>완전 독립</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          전화 사용, 쇼핑, 요리, 청소, 약물 관리, 금전 관리 등의 복합적 활동 수행 능력
        </p>
      </div>

      <div>
        <Label>이동 능력</Label>
        <RadioGroup
          value={assessmentData.functionalAssessment.mobilityLevel}
          onValueChange={(value) => updateAssessmentData("functionalAssessment", "mobilityLevel", value)}
          className="grid grid-cols-1 gap-2 mt-2"
        >
          {[
            "자유롭게 이동 가능",
            "보조기구 사용하여 이동",
            "부분적 도움 필요",
            "상당한 도움 필요",
            "휠체어 사용",
            "침상 안정",
          ].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <RadioGroupItem value={level} id={`mobility-${level}`} />
              <Label htmlFor={`mobility-${level}`}>{level}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label>안전 위험 요소 (해당사항 모두 선택)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {["낙상 위험", "화재 위험", "약물 오남용", "길 잃을 위험", "사기 피해 위험", "자해 위험"].map((risk) => (
            <div key={risk} className="flex items-center space-x-2">
              <Checkbox
                id={risk}
                checked={assessmentData.functionalAssessment.safetyRisks.includes(risk)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    addToArray("functionalAssessment", "safetyRisks", risk)
                  } else {
                    const index = assessmentData.functionalAssessment.safetyRisks.indexOf(risk)
                    if (index > -1) removeFromArray("functionalAssessment", "safetyRisks", index)
                  }
                }}
              />
              <Label htmlFor={risk}>{risk}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderMentalHealthScreening = () => (
    <div className="space-y-6">
      <div>
        <Label>우울 증상 점수 (PHQ-9 기반, 0-27)</Label>
        <div className="mt-2">
          <Slider
            value={[assessmentData.mentalHealthScreening.depressionScore]}
            onValueChange={(value) => updateAssessmentData("mentalHealthScreening", "depressionScore", value[0])}
            max={27}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>없음</span>
            <span className="font-medium">{assessmentData.mentalHealthScreening.depressionScore}</span>
            <span>심각</span>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {assessmentData.mentalHealthScreening.depressionScore <= 4 && "최소한의 우울"}
          {assessmentData.mentalHealthScreening.depressionScore >= 5 &&
            assessmentData.mentalHealthScreening.depressionScore <= 9 &&
            "경미한 우울"}
          {assessmentData.mentalHealthScreening.depressionScore >= 10 &&
            assessmentData.mentalHealthScreening.depressionScore <= 14 &&
            "중등도 우울"}
          {assessmentData.mentalHealthScreening.depressionScore >= 15 &&
            assessmentData.mentalHealthScreening.depressionScore <= 19 &&
            "중등도-심각 우울"}
          {assessmentData.mentalHealthScreening.depressionScore >= 20 && "심각한 우울"}
        </div>
      </div>

      <div>
        <Label>불안 증상 점수 (GAD-7 기반, 0-21)</Label>
        <div className="mt-2">
          <Slider
            value={[assessmentData.mentalHealthScreening.anxietyScore]}
            onValueChange={(value) => updateAssessmentData("mentalHealthScreening", "anxietyScore", value[0])}
            max={21}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>없음</span>
            <span className="font-medium">{assessmentData.mentalHealthScreening.anxietyScore}</span>
            <span>심각</span>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {assessmentData.mentalHealthScreening.anxietyScore <= 4 && "최소한의 불안"}
          {assessmentData.mentalHealthScreening.anxietyScore >= 5 &&
            assessmentData.mentalHealthScreening.anxietyScore <= 9 &&
            "경미한 불안"}
          {assessmentData.mentalHealthScreening.anxietyScore >= 10 &&
            assessmentData.mentalHealthScreening.anxietyScore <= 14 &&
            "중등도 불안"}
          {assessmentData.mentalHealthScreening.anxietyScore >= 15 && "심각한 불안"}
        </div>
      </div>

      <div>
        <Label>외로움 정도 (0-10)</Label>
        <div className="mt-2">
          <Slider
            value={[assessmentData.mentalHealthScreening.lonelinessScore]}
            onValueChange={(value) => updateAssessmentData("mentalHealthScreening", "lonelinessScore", value[0])}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>전혀 외롭지 않음</span>
            <span className="font-medium">{assessmentData.mentalHealthScreening.lonelinessScore}</span>
            <span>매우 외로움</span>
          </div>
        </div>
      </div>

      <div>
        <Label>인지 기능 점수 (MMSE 기반, 0-30)</Label>
        <div className="mt-2">
          <Slider
            value={[assessmentData.mentalHealthScreening.cognitiveScore]}
            onValueChange={(value) => updateAssessmentData("mentalHealthScreening", "cognitiveScore", value[0])}
            max={30}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>심각한 인지 장애</span>
            <span className="font-medium">{assessmentData.mentalHealthScreening.cognitiveScore}</span>
            <span>정상</span>
          </div>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          {assessmentData.mentalHealthScreening.cognitiveScore >= 24 && "정상"}
          {assessmentData.mentalHealthScreening.cognitiveScore >= 18 &&
            assessmentData.mentalHealthScreening.cognitiveScore <= 23 &&
            "경미한 인지 장애"}
          {assessmentData.mentalHealthScreening.cognitiveScore < 18 && "심각한 인지 장애"}
        </div>
      </div>

      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="suicidal"
            checked={assessmentData.mentalHealthScreening.suicidalIdeation}
            onCheckedChange={(checked) => updateAssessmentData("mentalHealthScreening", "suicidalIdeation", checked)}
          />
          <Label htmlFor="suicidal" className="text-red-800 font-medium">
            자살 사고나 계획이 있음
          </Label>
        </div>
        {assessmentData.mentalHealthScreening.suicidalIdeation && (
          <div className="mt-2 p-2 bg-red-100 rounded text-red-800 text-sm">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            즉시 전문의 상담 및 안전 계획 수립이 필요합니다.
          </div>
        )}
      </div>
    </div>
  )

  const renderPsychosocialFactors = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="losses">최근 1년 내 중요한 상실 경험</Label>
        <Textarea
          id="losses"
          placeholder="가족, 친구의 사망, 건강 상실, 역할 상실 등을 입력해주세요..."
          value={assessmentData.psychosocialFactors.recentLosses}
          onChange={(e) => updateAssessmentData("psychosocialFactors", "recentLosses", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="changes">주요 생활 변화</Label>
        <Textarea
          id="changes"
          placeholder="이사, 은퇴, 질병 진단, 가족 구성 변화 등을 입력해주세요..."
          value={assessmentData.psychosocialFactors.majorLifeChanges}
          onChange={(e) => updateAssessmentData("psychosocialFactors", "majorLifeChanges", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label>주요 대처 방식 (해당사항 모두 선택)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            "가족/친구와 대화",
            "종교/영성 활동",
            "운동/산책",
            "취미 활동",
            "TV 시청",
            "독서",
            "음악 감상",
            "혼자 있기",
            "술/약물",
            "기타",
          ].map((strategy) => (
            <div key={strategy} className="flex items-center space-x-2">
              <Checkbox
                id={strategy}
                checked={assessmentData.psychosocialFactors.copingStrategies.includes(strategy)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    addToArray("psychosocialFactors", "copingStrategies", strategy)
                  } else {
                    const index = assessmentData.psychosocialFactors.copingStrategies.indexOf(strategy)
                    if (index > -1) removeFromArray("psychosocialFactors", "copingStrategies", index)
                  }
                }}
              />
              <Label htmlFor={strategy}>{strategy}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="spiritual">영적/종교적 욕구</Label>
        <Textarea
          id="spiritual"
          placeholder="종교적 신념, 영적 욕구, 의미 추구 등에 대해 입력해주세요..."
          value={assessmentData.psychosocialFactors.spiritualNeeds}
          onChange={(e) => updateAssessmentData("psychosocialFactors", "spiritualNeeds", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="cultural">문화적 고려사항</Label>
        <Textarea
          id="cultural"
          placeholder="문화적 배경, 언어, 전통, 가치관 등에 대해 입력해주세요..."
          value={assessmentData.psychosocialFactors.culturalConsiderations}
          onChange={(e) => updateAssessmentData("psychosocialFactors", "culturalConsiderations", e.target.value)}
          rows={3}
        />
      </div>
    </div>
  )

  const renderGoalsAndExpectations = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="goals">어르신의 상담 목표</Label>
        <Textarea
          id="goals"
          placeholder="어르신께서 상담을 통해 달성하고 싶은 목표들을 입력해주세요..."
          value={assessmentData.goalsAndExpectations.clientGoals.join("\n")}
          onChange={(e) =>
            updateAssessmentData(
              "goalsAndExpectations",
              "clientGoals",
              e.target.value.split("\n").filter((goal) => goal.trim()),
            )
          }
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="expectations">상담에 대한 기대</Label>
        <Textarea
          id="expectations"
          placeholder="상담 과정이나 상담사에 대한 기대사항을 입력해주세요..."
          value={assessmentData.goalsAndExpectations.counselingExpectations}
          onChange={(e) => updateAssessmentData("goalsAndExpectations", "counselingExpectations", e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <Label>선호하는 상담 방식</Label>
        <RadioGroup
          value={assessmentData.goalsAndExpectations.preferredApproach}
          onValueChange={(value) => updateAssessmentData("goalsAndExpectations", "preferredApproach", value)}
          className="grid grid-cols-1 gap-2 mt-2"
        >
          {[
            "대화 중심",
            "활동 중심",
            "문제 해결 중심",
            "감정 표현 중심",
            "실용적 조언 중심",
            "상담사 주도",
            "본인 주도",
          ].map((approach) => (
            <div key={approach} className="flex items-center space-x-2">
              <RadioGroupItem value={approach} id={`approach-${approach}`} />
              <Label htmlFor={`approach-${approach}`}>{approach}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <Label>상담 참여 의지 (0-10)</Label>
        <div className="mt-2">
          <Slider
            value={[assessmentData.goalsAndExpectations.motivationLevel]}
            onValueChange={(value) => updateAssessmentData("goalsAndExpectations", "motivationLevel", value[0])}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>매우 소극적</span>
            <span className="font-medium">{assessmentData.goalsAndExpectations.motivationLevel}</span>
            <span>매우 적극적</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderPersonalInfo()
      case 1:
        return renderMedicalHistory()
      case 2:
        return renderSocialSupport()
      case 3:
        return renderFunctionalAssessment()
      case 4:
        return renderMentalHealthScreening()
      case 5:
        return renderPsychosocialFactors()
      case 6:
        return renderGoalsAndExpectations()
      default:
        return null
    }
  }

  const isCurrentSectionComplete = () => {
    // 각 섹션별 필수 필드 검증 로직
    switch (currentSection) {
      case 0:
        return (
          assessmentData.personalInfo.age > 0 &&
          assessmentData.personalInfo.gender &&
          assessmentData.personalInfo.maritalStatus
        )
      case 1:
        return (
          assessmentData.medicalHistory.chronicConditions.length > 0 ||
          assessmentData.medicalHistory.currentMedications.length > 0
        )
      case 2:
        return assessmentData.socialSupport.familyContact && assessmentData.socialSupport.emergencyContact
      case 3:
        return assessmentData.functionalAssessment.mobilityLevel
      case 4:
        return true // 슬라이더는 기본값이 있으므로 항상 완료
      case 5:
        return assessmentData.psychosocialFactors.copingStrategies.length > 0
      case 6:
        return assessmentData.goalsAndExpectations.clientGoals.length > 0
      default:
        return false
    }
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const completeAssessment = () => {
    onComplete(assessmentData)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-emerald-600" />
            {clientName} 어르신 종합 초기 평가
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{sections[currentSection].title}</span>
              <span>
                {currentSection + 1} / {sections.length}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 섹션 네비게이션 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            {sections.map((section, index) => {
              const Icon = section.icon
              const isCompleted = index < currentSection || (index === currentSection && isCurrentSectionComplete())
              const isCurrent = index === currentSection

              return (
                <Button
                  key={index}
                  variant={isCurrent ? "default" : isCompleted ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentSection(index)}
                  className={`flex items-center gap-1 ${section.color}`}
                >
                  <Icon className="h-3 w-3" />
                  {section.title}
                  {isCompleted && <CheckCircle className="h-3 w-3 ml-1" />}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 현재 섹션 내용 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(sections[currentSection].icon, {
              className: `h-5 w-5 ${sections[currentSection].color}`,
            })}
            {sections[currentSection].title}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderCurrentSection()}</CardContent>
      </Card>

      {/* 네비게이션 버튼 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevSection} disabled={currentSection === 0}>
              이전
            </Button>

            {currentSection === sections.length - 1 ? (
              <Button
                onClick={completeAssessment}
                disabled={!isCurrentSectionComplete()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                평가 완료
              </Button>
            ) : (
              <Button
                onClick={nextSection}
                disabled={!isCurrentSectionComplete()}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                다음
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
