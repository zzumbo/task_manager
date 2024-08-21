import React from 'react';
import './TaskCard.css';
import { Card, Typography, Chip, Avatar, Stack } from '@mui/material';
import { Task, TaskPriority } from '../../support/api/models';

interface TaskCardProps {
  task: Task;
  onClick: () => void; 
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <Card onClick={onClick} variant="outlined" className="taskCard">
      <Typography variant="h6">{task.title}</Typography>
      <Typography color="textSecondary">ID: {task.id}</Typography>      
      <p> Priority: <Chip label={task.priority} style={getPriorityColor(task.priority)} size="small"/></p>
      <p> Status:   <Chip label={task.status} color="info" size="small"/></p>
      <Stack direction="column" spacing={1} alignItems="left"> 
        Assignee(s): &nbsp;{task.assignedUsers && task.assignedUsers.length > 0 ? (
          task.assignedUsers.map((user) => (
            <Chip 
              key={user.id} 
              avatar={<Avatar alt={user.username} src={user.profilePictureUrl || ''} />}
              label={`${user.firstName} ${user.lastName}`} />
          ))
        ) : (
          <Typography color="textSecondary">None</Typography>
        )}
      </Stack>

    </Card>
  );
};

const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
        case 'NONE':
            return { backgroundColor: '#e0e0e0', color: '#000000' }; // Grey
        case 'LOW':
            return { backgroundColor: '#4caf50', color: '#ffffff' }; // Green
        case 'MEDIUM':
            return { backgroundColor: '#ffeb3b', color: '#000000' }; // Yellow
        case 'HIGH':
            return { backgroundColor: '#ff9800', color: '#ffffff' }; // Orange
        case 'CRITICAL':
            return { backgroundColor: '#f44336', color: '#ffffff' }; // Red
        default:
            return { backgroundColor: '#e0e0e0', color: '#000000' }; // Default grey
    }
};

export default TaskCard;