package models

import (
	"time"
)

type MainTask struct {
	ID           uint       `json:"id" gorm:"primaryKey"`
	Title        string     `json:"title"`
	Description  string     `json:"description"`
	Done         bool       `json:"done"`
	LetterNumber string     `json:"letter_number"`
	LetterDate   *time.Time `json:"letter_date"`
	DueDate      *time.Time `json:"due_date"`
	Subtasks     []Subtask  `json:"subtasks" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
