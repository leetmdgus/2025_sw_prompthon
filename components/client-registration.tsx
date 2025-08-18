"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, UserPlus, Phone, MapPin, Heart } from "lucide-react"

interface ClientRegistrationProps {
  onBack: () => void
  onComplete: (clientData: any) => void
}

export function ClientRegistration({ onBack, onComplete }: ClientRegistrationProps) {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "",
    phone: "",
    address: "",
    guardianName: "",
    guardianPhone: "",
    guardianRelation: "",
    medicalHistory: "",
    emergencyContact: "",
    specialNotes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-primary">어르신 등록</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">새로운 어르신 정보를 등록합니다</p>
            </div>
          </div>
          <UserPlus className="h-6 w-6 text-primary" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">성명 *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="어르신 성함을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">생년월일 *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange("birthDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">성별 *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="성별을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">연락처</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="거주지 주소를 입력하세요"
                />
              </div>
            </CardContent>
          </Card>

          {/* 보호자 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-accent" />
                보호자 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="guardianName">보호자 성명</Label>
                  <Input
                    id="guardianName"
                    value={formData.guardianName}
                    onChange={(e) => handleInputChange("guardianName", e.target.value)}
                    placeholder="보호자 성함"
                  />
                </div>
                <div>
                  <Label htmlFor="guardianPhone">보호자 연락처</Label>
                  <Input
                    id="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={(e) => handleInputChange("guardianPhone", e.target.value)}
                    placeholder="010-0000-0000"
                  />
                </div>
                <div>
                  <Label htmlFor="guardianRelation">관계</Label>
                  <Select
                    value={formData.guardianRelation}
                    onValueChange={(value) => handleInputChange("guardianRelation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="관계 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="son">아들</SelectItem>
                      <SelectItem value="daughter">딸</SelectItem>
                      <SelectItem value="spouse">배우자</SelectItem>
                      <SelectItem value="sibling">형제/자매</SelectItem>
                      <SelectItem value="other">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="emergencyContact">응급 연락처</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  placeholder="응급시 연락할 번호"
                />
              </div>
            </CardContent>
          </Card>

          {/* 추가 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" />
                추가 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="medicalHistory">병력 및 복용 약물</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  placeholder="주요 병력, 현재 복용 중인 약물 등을 입력하세요"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="specialNotes">특이사항</Label>
                <Textarea
                  id="specialNotes"
                  value={formData.specialNotes}
                  onChange={(e) => handleInputChange("specialNotes", e.target.value)}
                  placeholder="상담 시 주의사항, 특별한 요구사항 등을 입력하세요"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1 bg-transparent">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              등록 완료
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
