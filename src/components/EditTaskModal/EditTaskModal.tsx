import { ChangeEvent, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem, Select, FormControl, InputLabel, Chip, OutlinedInput } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Task, TaskStatus, TaskPriority, User } from '../../support/api/models';

const EditTaskModal = ({ open, task, onClose, onSave, allUsers }: { open: boolean, task: Task, onClose: () => void, onSave: (task: Task) => void, allUsers: User[] }) => {
  const [localTask, setLocalTask] = useState(task);

  useEffect(() => {
    if (open) {
      setLocalTask(task);
    }
  }, [open, task]);

  // Handle text changes
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLocalTask(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setLocalTask(prev => ({ ...prev, [name]: value }));
  };

  // Handle assignee changes
  const handleAssigneeChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;
    const updatedUsers = allUsers.filter(user => value.includes(user.id));
    setLocalTask(prev => ({ ...prev, assignedUsers: updatedUsers }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          name="title"
          value={localTask.title}
          onChange={handleTextChange}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={localTask.status}
            onChange={handleSelectChange}
            label="Status"
          >
            {Object.values(TaskStatus).map(status => (
              <MenuItem key={status} value={status}>
                {status.replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={localTask.priority}
            onChange={handleSelectChange}
            label="Priority"
          >
            {Object.values(TaskPriority).map(priority => (
              <MenuItem key={priority} value={priority}>
                {priority}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Assignees</InputLabel>
          <Select
            multiple
            name="assignedUsers"
            value={localTask.assignedUsers?.map(user => user.id) || []}
            onChange={handleAssigneeChange}
            input={<OutlinedInput label="Assignees" />}
            renderValue={(selectedIds) => (
              <div>
                {localTask.assignedUsers?.filter(user => selectedIds.includes(user.id)).map(user => (
                  <Chip key={user.id} label={`${user.firstName} ${user.lastName}`} />
                ))}
              </div>
            )}
          >
            {allUsers.map(user => (
              <MenuItem key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(localTask)}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
