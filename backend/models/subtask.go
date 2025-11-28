package models

import "time"

type Subtask struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	MainTaskID  uint      `json:"main_task_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Done        bool      `json:"done"`
	StartDate   time.Time `json:"startSubtask"`
	FinishDate  time.Time `json:"finishSubtask"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
