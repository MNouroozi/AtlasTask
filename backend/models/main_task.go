package models

import (
	"time"
)

type TaskStatus string

const (
	TaskStatusFollowUp TaskStatus = "پیگیری"
	TaskStatusAction   TaskStatus = "اقدام"
	TaskStatusReminder TaskStatus = "یادآوری"
)

type MainTask struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	Title        string     `json:"title"`
	Description  string     `json:"description"`
	Done         bool       `json:"done"`
	LetterNumber string     `json:"letter_number"`
	LetterDate   *time.Time `json:"letter_date"`
	DueDate      *time.Time `json:"due_date"`
	Status       TaskStatus `json:"status" gorm:"type:varchar(20)"`
	Subtasks     []Subtask  `json:"subtasks" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
