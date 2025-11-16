// توضیح فارسی: مدل وظایف اصلی با تاریخ‌ها و زیر‌وظایف اختیاری
package models

import (
	"time"
)

// MainTask مدل وظایف اصلی در سیستم AtlasTask
type MainTask struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	Title        string     `json:"title"`
	Description  string     `json:"description"`
	Done         bool       `json:"done"`
	LetterNumber string     `json:"letter_number"` // شماره نامه ارجاع
	LetterDate   *time.Time `json:"letter_date"`   // تاریخ نامه (اختیاری، nullable)
	DueDate      *time.Time `json:"due_date"`      // تاریخ مهلت اقدام (اختیاری، nullable)
	Subtasks     []Subtask  `json:"subtasks" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
