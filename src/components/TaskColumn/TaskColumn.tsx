import React from 'react';
import { Grid } from '@mui/material';
import TaskCard from '../TaskCard/TaskCard';
import { Task, TaskStatus } from '../../support/api/models';


interface TaskColumnProps {
  tasks: Task[];
  status: TaskStatus;
  onEditTask: (taskId: string) => void; 
}

const TaskColumn: React.FC<TaskColumnProps> = ({ tasks, status, onEditTask }) => {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <h2>{status}</h2>
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} onClick={() => onEditTask(task.id)} />
      ))}
    </Grid>
  );
};

export default TaskColumn;
